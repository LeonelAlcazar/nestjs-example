import { Module } from '@nestjs/common';
import { ConsumeNotificationsService } from './services/consume-notifications/consume-notifications.service';
import { ProduceNotificationsService } from './services/produce-notifications/produce-notifications.service';

@Module({
  providers: [ConsumeNotificationsService, ProduceNotificationsService],
  exports: [ProduceNotificationsService],
})
export class NotificationsModule {}
