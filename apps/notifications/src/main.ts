import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationsModule,
    /* {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
          clientId: 'notifications',
        },
        consumer: {
          groupId: 'notifications-consumer',
        },
      },
    }, */
    {
      transport: Transport.REDIS,
      options: {
        host: 'localhost',
        port: 6379,
        password: 'contrasena',
      },
    },
  );
  await app.listen();
}
bootstrap();
