import { Body, Controller, Post } from '@nestjs/common';
import { OperatorLogin } from 'src/operator/dtos/operator-login.dto';
import { OperatorAuthService } from 'src/operator/services/operator-auth/operator-auth.service';

@Controller('operator-auth')
export class OperatorAuthController {
  constructor(private operatorAuthService: OperatorAuthService) {}

  @Post('/login')
  async login(@Body() data: OperatorLogin) {
    return this.operatorAuthService.login(data.email, data.password);
  }
}
