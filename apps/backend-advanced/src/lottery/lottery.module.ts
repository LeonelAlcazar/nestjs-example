import { Module } from '@nestjs/common';
import { LotteryService } from './services/lottery/lottery.service';
import { LotteryController } from './controllers/lottery/lottery.controller';
import { LotteryTicketService } from './services/lottery-ticket/lottery-ticket.service';
import { LotteryTicketController } from './controllers/lottery-ticket/lottery-ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lottery } from './entities/lottery.entity';
import { LotteryTicket } from './entities/lottery-ticket.entity';
import { WalletModule } from 'src/user/wallet/wallet.module';
import { OperatorModule } from 'src/operator/operator.module';
import { UserModule } from 'src/user/user.module';
import { CommonModule } from 'src/common/common.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lottery, LotteryTicket]),
    WalletModule,
    OperatorModule,
    UserModule,
    CommonModule,
  ],
  providers: [LotteryService, LotteryTicketService],
  controllers: [LotteryTicketController, LotteryController],
})
export class LotteryModule {}
