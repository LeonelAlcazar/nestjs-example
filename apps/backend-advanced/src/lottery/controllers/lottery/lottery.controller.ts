/* import { CacheInterceptor } from '@nestjs/cache-manager'; */
/* import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
} from '@nestjs/cache-manager'; */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CacheEndpoint } from 'src/ccache/decorators/cache.decorator';
import { CacheInterceptor } from 'src/ccache/interceptors/cache.interceptor';
import { UrlUtilsService } from 'src/common/services/url-utils/url-utils.service';
import { LotteryCreateDTO } from 'src/lottery/dtos/lottery-create.dto';
import { LotteryService } from 'src/lottery/services/lottery/lottery.service';
import { OperatorAuthentication } from 'src/operator/decorators/operator-authentication.decorator';

@ApiTags('lottery')
@Controller('lottery')
export class LotteryController {
  constructor(
    private lotteryService: LotteryService,
    private urlUtilsService: UrlUtilsService,
  ) {}

  @Get('/test')
  @UseInterceptors(CacheInterceptor)
  async test() {
    console.log('test');
    return 'test';
  }

  @Get('/')
  @CacheEndpoint({
    ttl: 1000 * 60 * 60,
  })
  async list(@Query() query: any) {
    const { criteria, pagination } =
      this.urlUtilsService.getPaginationAndCriteriaFromQuery(query);
    const data = await this.lotteryService.findAll(criteria, pagination);
    return data;
  }

  @Get('/:id')
  /* @CacheTTL(1000 * 60 * 60)
  @UseInterceptors(CacheInterceptor) */
  @CacheEndpoint({
    ttl: 1000 * 60 * 60,
  })
  async get(@Param('id') id: string) {
    return this.lotteryService.findOne({ id });
  }

  @OperatorAuthentication()
  @Post('/')
  async create(@Body() data: LotteryCreateDTO, @Req() req: Request) {
    return this.lotteryService.create(data, req['operator'].id);
  }

  @OperatorAuthentication()
  @Post('/:id/execute')
  async execute(@Param('id') id: string) {
    return this.lotteryService.executeLottery(id);
  }
}
