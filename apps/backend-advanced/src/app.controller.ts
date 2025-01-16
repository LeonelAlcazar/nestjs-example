import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('metrics')
  @Header('Content-Type', 'text/plain')
  getMetrics(): Promise<string> {
    return this.appService.getMetrics();
  }
}
