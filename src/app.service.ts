import { InjectRedis } from '@nestjs-modules/ioredis';
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { Logger } from 'winston';

@Injectable()
export class AppService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @Inject('winston')
    private readonly logger: Logger,
  ) {
    redis.set('time', new Date().toISOString(), 'PX', 1000 * 60 * 10);
    logger.info('AppService created');
    logger.error('AppService created');
  }

  getHello(): string {
    return 'Hello World!';
  }
}
