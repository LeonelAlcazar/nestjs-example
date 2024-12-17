import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Kafka, logLevel, Producer } from 'kafkajs';
import { resolve } from 'path';
import configuration from 'src/config/configuration';

@Injectable()
export class ProduceNotificationsService {
  private kafka: Kafka;
  private producer: Producer;

  constructor(
    @Inject(configuration.KEY)
    private configService: ConfigType<typeof configuration>,
  ) {}

  async onModuleInit() {
    /* this.kafka = new Kafka({
      clientId: this.configService.kafka.clientId + '-producer',
      brokers: [this.configService.kafka.broker],
      logCreator: (level: logLevel) => {
        return (entry) => {
          Logger.log(entry);
        };
      },
    });

    this.producer = this.kafka.producer();
    await this.producer.connect(); */
    /* this.producer.on(this.producer.events.DISCONNECT, async (e) => {
      while (true) {
        try {
          this.onModuleInit();
        } catch (e) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }); */
  }

  async sendNotification(data: {
    userId: string;
    title: string;
    body: string;
  }) {
    try {
      await this.producer.send({
        topic: this.configService.kafka.notificationsTopic,
        messages: [
          {
            value: JSON.stringify(data),
          },
        ],
      });
    } catch (e) {
      Logger.error(e);
    }
  }
}
