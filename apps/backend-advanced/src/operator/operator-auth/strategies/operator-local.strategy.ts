import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { OperatorAuthService } from '../services/operator-auth/operator-auth.service';

@Injectable()
export class OperatorLocalStrategy extends PassportStrategy(
  Strategy,
  'operator-local',
) {
  constructor(private operatorAuthService: OperatorAuthService) {
    super(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      (email, password, done) => {
        done(null, this.validate(email, password));
      },
    );
  }

  async validate(email: string, password: string) {
    const operator = this.operatorAuthService.validate(email, password);

    if (!operator) {
      throw new UnauthorizedException();
    }

    return operator;
  }
}
