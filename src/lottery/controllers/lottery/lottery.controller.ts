import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
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

  @Get('/')
  async list(@Query() query: any) {
    const { criteria, pagination } =
      this.urlUtilsService.getPaginationAndCriteriaFromQuery(query);
    return this.lotteryService.findAll(criteria, pagination);
  }

  @Get('/:id')
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
