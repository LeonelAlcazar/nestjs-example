import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
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
    let request = context.switchToHttp().getRequest();

    if (!request) {
      const ctx = GqlExecutionContext.create(context);
      request = ctx.getContext().req;
    }

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
