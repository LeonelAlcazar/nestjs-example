import {
  ConflictException,
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
import { ChatGateway } from 'src/user/gateways/chat/chat.gateway';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userAuthService: UserAuthService,
    private chatGateway: ChatGateway,
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
