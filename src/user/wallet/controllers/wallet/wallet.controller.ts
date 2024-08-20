import { Controller, Get, Param } from '@nestjs/common';
import { WalletService } from '../../services/wallet/wallet.service';
import { UserAuthentication } from 'src/user/decorators/user-authentication.decorator';

@Controller('user/:id/wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @UserAuthentication()
  @Get('/')
  async getBalance(@Param('id') id: string) {
    this.walletService.getUserBalance(id);
  }
}
