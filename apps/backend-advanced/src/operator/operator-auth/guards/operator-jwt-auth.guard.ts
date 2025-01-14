import { InjectRedis } from '@nestjs-modules/ioredis';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import Redis from 'ioredis';
import { isObservable, lastValueFrom, Observable } from 'rxjs';
import { AsyncAction } from 'rxjs/internal/scheduler/AsyncAction';

@Injectable()
export class OperatorJWTAuth extends AuthGuard('operator-jwt') {
  constructor(
    @InjectRedis() private redis: Redis,
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const tokenType =
      this.reflector.get<string>('TOKEN_TYPE', context.getHandler()) ||
      'access';

    const token = this.extractTokenFromHeader(request);

    const payload = this.jwtService.decode(token);

    console.log(payload, tokenType);

    if (payload.token_type != tokenType) {
      return false;
    }

    if (tokenType != 'refresh') {
      const valueExist = await this.redis.get(token);

      console.log(valueExist);

      if (!valueExist) {
        return false;
      }
    }

    const rsp = await super.canActivate(context);

    if (isObservable(rsp)) {
      return await lastValueFrom(rsp);
    }

    return rsp;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
