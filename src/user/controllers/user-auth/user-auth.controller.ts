import { Body, Controller, Post } from '@nestjs/common';
import { UserLogin } from 'src/user/dtos/user-login.dto';
import { UserAuthService } from 'src/user/services/user-auth/user-auth.service';

@Controller('user/auth')
export class UserAuthController {
  constructor(private userAuthService: UserAuthService) {}

  @Post('/login')
  async login(@Body() data: UserLogin) {
    return this.userAuthService.login(data.email, data.password);
  }
}
