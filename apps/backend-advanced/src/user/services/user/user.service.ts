import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserAuthService } from '../user-auth/user-auth.service';
import { Pagination } from 'src/common/types/pagination.type';
import { UserRegisterDTO } from 'src/user/dtos/user-register.dto';
import { instanceToPlain } from 'class-transformer';
import { ProduceNotificationsService } from 'src/notifications/services/produce-notifications/produce-notifications.service';
import { ChatGateway } from 'src/user/gateways/chat/chat.gateway';
import { ClientKafka, ClientRedis } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userAuthService: UserAuthService,
    private chatGateway: ChatGateway,
    private produceNotificationsServices: ProduceNotificationsService,
    @Inject('NOTIFICATIONS_SERVICE') private notifications: ClientRedis,
  ) {}

  async findAll(
    criteria: FindOptionsWhere<User>,
    pagination: Pagination,
  ): Promise<{
    users: User[];
    total: number;
  }> {
    const [users, total] = await this.userRepository.findAndCount({
      where: criteria,
      take: pagination.limit,
      skip: (pagination.page - 1) * pagination.limit,
    });
    return { users, total };
  }

  async findOne(criteria: FindOptionsWhere<User>): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: criteria });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      this.chatGateway.sendMessage(
        'message',
        user.name + ' Fuiste buscado',
        'room-' + user.id,
      );

      /* this.produceNotificationsServices.sendNotification({
        userId: user.id,
        title: 'Fuiste buscado',
        body: user.name + ' Fuiste buscado',
      }); */

      const response = await this.notifications.send(
        'notifications.' + user.id,
        {
          userId: user.id,
          title: 'Fuiste buscado',
          body: user.name + ' Fuiste buscado',
        },
      );

      console.log('Notification response:', await lastValueFrom(response));

      return user;
    } catch (e) {
      throw new NotFoundException('User not found');
    }
  }

  async register(data: UserRegisterDTO): Promise<any> {
    const userExists = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const user = new User();
    user.name = data.name;
    user.email = data.email;

    // Guarda el usuario primero
    const savedUser = await this.userRepository.save(user);

    // Genera la autenticación y la relaciona con el usuario
    const userAuth = await this.userAuthService.generateAuth(
      data.email,
      data.password,
      savedUser,
    );

    // Asigna el auth al usuario
    savedUser.auth = userAuth;

    // Actualiza el usuario
    await this.userRepository.save(savedUser);

    // Convirtiendo a JSON plano sin las referencias circulares
    return this.findOne({ id: savedUser.id });
  }
}
