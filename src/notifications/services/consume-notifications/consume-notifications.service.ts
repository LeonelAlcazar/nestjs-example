import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Kafka, logLevel } from 'kafkajs';
import configuration from 'src/config/configuration';

@Injectable()
export class ConsumeNotificationsService {
  private kafka: Kafka;

  constructor(
    @Inject(configuration.KEY)
    private configService: ConfigType<typeof configuration>,
  ) {}

  async onModuleInit() {
    this.kafka = new Kafka({
      clientId: this.configService.kafka.clientId + '-consumer',
      brokers: [this.configService.kafka.broker],
      logCreator: (level: logLevel) => {
        return (entry) => {
          Logger.log(entry);
        };
      },
    });
    this.consumeMessages(this.configService.kafka.notificationsTopic);
  }

  async consumeMessages(topic: string) {
    const consumer = this.kafka.consumer({
      groupId: this.configService.kafka.groupId,
    });
    await consumer.connect();
    await consumer.subscribe({
      topic,
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          value: message.value.toString(),
          topic,
          partition,
          size: message.size,
          offset: message.offset,
          timestamp: message.timestamp,
        });
        await this.sendNotification(message.value.toString());
      },
    });
  }

  async sendNotification(data: any) {
    // ...
  }
}
