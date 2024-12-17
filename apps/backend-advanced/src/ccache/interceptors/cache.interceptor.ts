import { InjectRedis } from '@nestjs-modules/ioredis';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import Redis from 'ioredis';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    console.log('Before...');
    const request: Request = context.switchToHttp().getRequest();
    const ttl = this.reflector.get<number>('cache_ttl', context.getHandler());

    const cacheKey = request.url;
    try {
      const cache = await this.redis.get(cacheKey);

      if (cache) {
        return of(JSON.parse(cache));
      }

      const now = Date.now();
      return next.handle().pipe(
        tap(async (response) => {
          try {
            await this.redis.set(cacheKey, JSON.stringify(response), 'PX', ttl);
            console.log('After...', Date.now() - now);
          } catch (e) {
            console.log('Error', e);
          }
        }),
      );
    } catch (e) {
      return next.handle();
    }
  }
}
