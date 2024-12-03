import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserAuth } from 'src/user/entities/user-auth.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class UserAuthService {
  constructor(
    @InjectRepository(UserAuth)
    private userAuthRepository: Repository<UserAuth>,
    private jwtService: JwtService,
  ) {}

  async validateToken(token: string): Promise<{ userId: number }> {
    try {
      const { sub: userId } = await this.jwtService.verifyAsync(token);

      const userAuth = await this.userAuthRepository.findOne({
        where: { userId },
      });

      if (!userAuth) {
        throw new UnauthorizedException('Invalid token');
      }

      return { userId };
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async generateAuth(
    email: string,
    password: string,
    user: User,
  ): Promise<UserAuth> {
    const userAuth = new UserAuth();
    userAuth.email = email;
    userAuth.password = await bcrypt.hash(password, 10);

    // Establecemos la relación con el usuario
    userAuth.user = user;

    // Guardamos el UserAuth en la base de datos
    return await this.userAuthRepository.save(userAuth);
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

    const match = await bcrypt.compare(password, userAuth.password);

    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      access_token: await this.jwtService.signAsync({ sub: userAuth.userId }),
    };
  }
}
