import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { UrlUtilsService } from 'src/common/services/url-utils/url-utils.service';
import { LotteryTicketCreateDTO } from 'src/lottery/dtos/lottery-ticket-create.dto';
import { LotteryTicketService } from 'src/lottery/services/lottery-ticket/lottery-ticket.service';
import { UserAuthentication } from 'src/user/decorators/user-authentication.decorator';

@Controller('lottery/ticket')
export class LotteryTicketController {
  constructor(
    private lotteryTicketService: LotteryTicketService,
    private urlUtilsService: UrlUtilsService,
  ) {}

  @Get('/')
  async findAll(@Query() query: any) {
    const { criteria, pagination } =
      this.urlUtilsService.getPaginationAndCriteriaFromQuery(query);
    return this.lotteryTicketService.findAll(criteria, pagination);
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return this.lotteryTicketService.findOne({ id });
  }

  @UserAuthentication()
  @Post('/')
  async create(@Body() data: LotteryTicketCreateDTO, @Req() req: Request) {
    return this.lotteryTicketService.create(data, req['user'].id);
  }
}
