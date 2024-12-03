import { Cron, CronExpression } from '@nestjs/schedule';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserAuthService } from 'src/user/services/user-auth/user-auth.service';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private users: number[] = [];

  constructor(private userAuthService: UserAuthService) {}

  @SubscribeMessage('join-chat')
  async handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() token: string,
  ) {
    try {
      const { userId } = await this.userAuthService.validateToken(token);
      client.join(`room-${userId}`);
      client.join('room-general');
      this.users.push(userId);
      this.server.to('room-general').emit('message', {
        username: 'System',
        message: 'Bienvenido al chat',
      });
    } catch (e) {
      client.emit('error', e.message);
    }
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: string,
  ) {
    const payload = JSON.parse(data);
    const { userId } = await this.userAuthService.validateToken(payload.token);
    if (this.users.includes(userId) && payload.message.length > 0) {
      this.server.to('room-general').emit('message', {
        username: payload.username,
        message: payload.message,
      });
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron() {
    console.log('Called when the second is 5');
    this.server.to('room-public').emit('message', {
      username: 'System',
      message: 'Hola usuarios',
    });
  }

  public sendMessage(event: string, message: any, room: string) {
    this.server.to(room).emit(event, message);
  }
}
