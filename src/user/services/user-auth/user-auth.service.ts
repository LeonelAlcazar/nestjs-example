import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserAuth } from 'src/user/entities/user-auth.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserAuthService {
  constructor(
    @InjectRepository(UserAuth)
    private userAuthRepository: Repository<UserAuth>,
    private jwtService: JwtService,
  ) {}

  async generateAuth(email: string, password: string): Promise<UserAuth> {
    const userAuth = new UserAuth();
    userAuth.email = email;
    userAuth.password = await bcrypt.hash(password, 10);
    return userAuth;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const userAuth = await this.userAuthRepository.findOne({
      where: { email },
    });

    if (!userAuth) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = bcrypt.compare(password, userAuth.password);

    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      access_token: await this.jwtService.signAsync({ sub: userAuth.userId }),
    };
  }
}
