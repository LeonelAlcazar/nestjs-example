import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { OperatorAuth } from 'src/operator/entities/operator-auth.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Operator } from 'src/operator/entities/operator.entity';

@Injectable()
export class OperatorAuthService {
  constructor(
    @InjectRepository(OperatorAuth)
    private operatorAuthRepository: Repository<OperatorAuth>,
    @InjectRepository(Operator)
    private operatorRepository: Repository<Operator>,
    private jwtService: JwtService,
  ) {}

  async generate(email: string, password: string) {
    const operatorAuth = new OperatorAuth();
    operatorAuth.email = email;
    operatorAuth.password = await bcrypt.hash(password, 10);

    return operatorAuth;
  }

  async validate(email: string, password: string): Promise<Operator | null> {
    const operatorAuth = await this.operatorAuthRepository.findOne({
      where: { email },
    });

    console.log(operatorAuth, email, password);

    if (!operatorAuth) {
      return null;
    }

    const match = await bcrypt.compare(password, operatorAuth.password);
    if (!match) {
      return null;
    }

    return this.operatorRepository.findOne({
      where: {
        id: operatorAuth.operatorId,
      },
    });
  }

  async login(operator: Operator) {
    const access_token = this.jwtService.sign(
      {
        sub: operator.id,
        token_type: 'access',
      },
      {
        expiresIn: '15m',
      },
    );

    const refresh_token = this.jwtService.sign(
      {
        sub: operator.id,
        token_type: 'refresh',
      },
      {
        expiresIn: '7d',
      },
    );

    return {
      access_token,
      refresh_token,
    };
  }
}
