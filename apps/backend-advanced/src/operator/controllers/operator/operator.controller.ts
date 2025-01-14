import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { OperatorAuthentication } from 'src/operator/decorators/operator-authentication.decorator';
import { OperatorRegisterDTO } from 'src/operator/dtos/operator-register.dto';
import { OperatorJWTAuth } from 'src/operator/operator-auth/guards/operator-jwt-auth.guard';
import { OperatorService } from 'src/operator/services/operator/operator.service';

@ApiTags('operator')
@Controller('operator')
export class OperatorController {
  constructor(private operatorService: OperatorService) {}

  @Get('/me')
  @CacheTTL(1000 * 60 * 60 * 24 * 7)
  @UseInterceptors(CacheInterceptor)
  @UseGuards(OperatorJWTAuth)
  //@OperatorAuthentication()
  async me(@Req() req: Request) {
    return this.operatorService.findOne({ id: req['user'].id });
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
