import { Controller, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @MessagePattern('notifications.*')
  async CreateNotification(data: any) {
    console.log('New notification', data);

    return [0, 1.5, 'sent'];
  }
}
