import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { WalletService } from '../../services/wallet/wallet.service';
import { UserAuthentication } from 'src/user/decorators/user-authentication.decorator';
import { OperatorAuthentication } from 'src/operator/decorators/operator-authentication.decorator';
import { AddIncome } from '../../dtos/add-income.dto';
import { Request } from 'express';
import { RequestWithdrawal } from '../../dtos/request-withdrawal.dto';
import { WithdrawalStatus } from '../../entities/withdrawal.entity';
import { ChangeWithdrawalStatus } from '../../dtos/change-withdrawal-status.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('wallet')
@Controller('user/:id/wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @UserAuthentication()
  @Get('/')
  async getBalance(@Param('id') id: string) {
    return this.walletService.getUserBalance(id);
  }

  @OperatorAuthentication()
  @Post('/income')
  async addIncome(
    @Body() data: AddIncome,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return this.walletService.addIncome(id, data.amount, req['operator'].id);
  }

  @UserAuthentication()
  @Post('/withdrawal')
  async requestWithdrawal(
    @Body() data: RequestWithdrawal,
    @Req() request: Request,
  ) {
    return this.walletService.requestWithdrawal(
      request['user'].id,
      data.amount,
    );
  }

  @OperatorAuthentication()
  @Patch('/withdrawal/:id/status')
  async updateWithdrawalStatus(
    @Param('id') id: string,
    @Body() { status }: ChangeWithdrawalStatus,
    @Req() req: Request,
  ) {
    return this.walletService.changeWithdrawalStatus(
      id,
      status as WithdrawalStatus,
      req['operator'].id,
    );
  }
}
