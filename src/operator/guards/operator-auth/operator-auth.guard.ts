import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { OperatorService } from 'src/operator/services/operator/operator.service';

@Injectable()
export class OperatorAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private operatorService: OperatorService,
    private reflector: Reflector,
    /* @Inject(CACHE_MANAGER) private cacheManager: Cache, */
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }
    const token = this.extractTokenFromHeader(request);
    console.log(token);

    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      console.log(payload);

      /* const cachedOperator = await this.cacheManager.get(
        `operator:${payload.sub}`,
      );
      if (cachedOperator) {
        request.operator = cachedOperator;
        return true;
      } */
      const operator = await this.operatorService.findOne({ id: payload.sub });
      console.log(operator);
      request.operator = operator;
      /* await this.cacheManager.set(
        `operator:${payload.sub}`,
        operator,
        1000 * 60 * 60 * 24 * 7,
      ); */

      return true;
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
