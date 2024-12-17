import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OperatorAuthentication } from 'src/operator/decorators/operator-authentication.decorator';
import { OperatorRegisterDTO } from 'src/operator/dtos/operator-register.dto';
import { OperatorService } from 'src/operator/services/operator/operator.service';

@ApiTags('operator')
@Controller('operator')
export class OperatorController {
  constructor(private operatorService: OperatorService) {}

  @Get('/me')
  @CacheTTL(1000 * 60 * 60 * 24 * 7)
  @UseInterceptors(CacheInterceptor)
  @OperatorAuthentication()
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
