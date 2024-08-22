import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from './entities/income.entity';
import { Withdrawal } from './entities/withdrawal.entity';
import { LotteryTicket } from 'src/lottery/entities/lottery-ticket.entity';
import { WalletService } from './services/wallet/wallet.service';
import { WalletController } from './controllers/wallet/wallet.controller';
import { UserModule } from '../user.module';
import { OperatorModule } from 'src/operator/operator.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Income, Withdrawal, LotteryTicket]),
    forwardRef(() => UserModule),
    OperatorModule,
  ],
  providers: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}
