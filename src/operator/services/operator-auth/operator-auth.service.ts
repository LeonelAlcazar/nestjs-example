import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OperatorAuth } from 'src/operator/entities/operator-auth.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OperatorAuthService {
  constructor(
    @InjectRepository(OperatorAuth)
    private operatorAuthRepository: Repository<OperatorAuth>,
    private jwtService: JwtService,
  ) {}

  async generate(email: string, password: string) {
    const operatorAuth = new OperatorAuth();
    operatorAuth.email = email;
    operatorAuth.password = await bcrypt.hash(password, 10);

    return operatorAuth;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const operatorAuth = await this.operatorAuthRepository.findOne({
      where: { email },
    });

    if (!operatorAuth) {
      throw new UnauthorizedException('Unauthorized');
    }

    const match = await bcrypt.compare(password, operatorAuth.password);
    if (!match) {
      throw new UnauthorizedException('Unauthorized');
    }

    const payload = { sub: operatorAuth.id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
