import {
  Body,
  Controller,
  Post,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OperatorLogin } from 'src/operator/dtos/operator-login.dto';
import { OperatorAuthService } from '../../services/operator-auth/operator-auth.service';
import { AuthGuard } from '@nestjs/passport';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { OperatorJWTAuth } from '../../guards/operator-jwt-auth.guard';
@ApiTags('operator-auth')
@Controller('operator-auth')
export class OperatorAuthController {
  constructor(
    private operatorAuthService: OperatorAuthService,
    @InjectRedis() private redis: Redis,
  ) {}

  @UseGuards(AuthGuard(['operator-local']))
  @Post('/login')
  async login(@Body() data: OperatorLogin, @Req() req: any) {
    const resp = await this.operatorAuthService.login(req.user);

    await this.redis.set(resp.access_token, 1, 'EX', 60 * 60);

    return resp;
  }

  @SetMetadata('TOKEN_TYPE', 'refresh')
  @UseGuards(OperatorJWTAuth)
  @Post('/refresh')
  async refresh(@Req() req: any) {
    const resp = await this.operatorAuthService.login(req.user);

    await this.redis.set(resp.access_token, 1, 'EX', 60 * 60);

    return resp;
  }
}
