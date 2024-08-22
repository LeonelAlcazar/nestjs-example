import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { OperatorAuthentication } from 'src/operator/decorators/operator-authentication.decorator';
import { OperatorRegisterDTO } from 'src/operator/dtos/operator-register.dto';
import { OperatorService } from 'src/operator/services/operator/operator.service';

@Controller('operator')
export class OperatorController {
  constructor(private operatorService: OperatorService) {}

  @OperatorAuthentication()
  @Get('/me')
  async me(@Req() req: Request) {
    return this.operatorService.findOne({ id: req['operator'].id });
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return this.operatorService.findOne({ id });
  }

  @OperatorAuthentication()
  @Post('/')
  async register(@Body() data: OperatorRegisterDTO) {
    return this.operatorService.register(data);
  }
}
