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

  async getMetrics(): Promise<string> {
    let metrics = '';
    const keys = await this.redis.keys('metric:*');

    for (const key of keys) {
      const metricType = key.split(':')[1];
      const value = await this.redis.get(key);

      const endpoint = key.match(/metric:.*:.*:(.*)/)[1];
      const method = key.split(':')[2];

      switch (metricType) {
        case 'count':
          metrics += `call_count_endpoint{endpoint="${endpoint}",method="${method}"} ${value}\n`;
          break;
        case 'success_count':
          metrics += `call_success_count_endpoint{endpoint="${endpoint}",method="${method}"} ${value}\n`;
          break;
        case 'latency':
          metrics += `call_latency_endpoint{endpoint="${endpoint}",method="${method}"} ${value}\n`;
          break;
      }
    }

    return metrics;
  }
}
