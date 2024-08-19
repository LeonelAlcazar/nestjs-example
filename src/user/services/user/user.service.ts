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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userAuthService: UserAuthService,
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
    const user = await this.userRepository.findOne({ where: criteria });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async register(data: UserRegisterDTO): Promise<User> {
    const userExists = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const user = new User();
    user.name = data.name;
    user.email = data.email;
    user.auth = await this.userAuthService.generateAuth(
      data.email,
      data.password,
    );

    await this.userRepository.save(user);

    return user;
  }
}
