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
export class EndpointMetricsInterceptor implements NestInterceptor {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    console.log('Before...');
    const now = Date.now();
    const request: Request = context.switchToHttp().getRequest();

    const callCountKey = 'metric:count:' + request.method + ':' + request.path;
    const callSuccessCountKey =
      'metric:success_count:' + request.method + ':' + request.path;
    const callLatencyKey =
      'metric:latency:' + request.method + ':' + request.path;
    try {
      await this.redis.incr(callCountKey);
      const callSuccessCount = await this.redis.get(callSuccessCountKey);

      if (!callSuccessCount) {
        await this.redis.set(callSuccessCountKey, 0);
      }

      return next.handle().pipe(
        tap(async (response) => {
          try {
            const latency = Date.now() - now;
            await this.redis.incr(callSuccessCountKey);
            await this.redis.set(callLatencyKey, latency);
            console.log('After...', latency, 'ms');
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
