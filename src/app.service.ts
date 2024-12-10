import { InjectRedis } from '@nestjs-modules/ioredis';
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { Logger } from 'winston';
import { OperatorService } from './operator/services/operator/operator.service';

@Injectable()
export class AppService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @Inject('winston')
    private readonly logger: Logger,
    private operatorService: OperatorService,
  ) {
    redis.set('time', new Date().toISOString(), 'PX', 1000 * 60 * 10);
    logger.info('AppService created');
    logger.error('AppService created');

    // Create default operators
    this.operatorService.setup();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
