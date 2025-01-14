import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import configuration from 'src/config/configuration';
import { Operator } from 'src/operator/entities/operator.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OperatorJWTStrategy extends PassportStrategy(
  Strategy,
  'operator-jwt',
) {
  constructor(
    @Inject(configuration.KEY)
    private configService: ConfigType<typeof configuration>,
    @InjectRepository(Operator)
    private operatorRepository: Repository<Operator>,
    private reflector: Reflector,
  ) {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: configService.jwt.secret,
      },
      (token, done) => done(null, this.validate(token)),
    );
  }

  async validate(payload: {
    sub: string;
    token_type: string;
  }): Promise<Operator> {
    const operator = await this.operatorRepository.findOne({
      where: {
        id: payload.sub,
      },
    });

    if (!operator) {
      throw new UnauthorizedException();
    }

    return operator;
  }
}
