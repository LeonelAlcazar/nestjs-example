import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Income } from '../../entities/income.entity';
import { Repository } from 'typeorm';
import { Withdrawal } from '../../entities/withdrawal.entity';
import { LotteryTicket } from 'src/lottery/entities/lottery-ticket.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Income)
    private incomeRepository: Repository<Income>,
    @InjectRepository(Withdrawal)
    private withdrawalRepository: Repository<Withdrawal>,
    @InjectRepository(LotteryTicket)
    private lotteryTicketRepository: Repository<LotteryTicket>,
  ) {}

  async getUserBalance(userId: string): Promise<{
    income: number;
    withdrawal: number;
    lotteryTicket: number;
    inPlatform: number;
    balance: number;
  }> {
    try {
      const incomes = await this.incomeRepository.find({
        where: {
          userId,
        },
      });
      const withdrawals = await this.withdrawalRepository.find({
        where: {
          userId,
        },
      });
      const lotteryTickets = await this.lotteryTicketRepository.find({
        where: {
          userId,
        },
      });
      const income = incomes.reduce((acc, income) => acc + income.amount, 0);
      const withdrawal = withdrawals.reduce(
        (acc, withdrawal) => acc + withdrawal.amount,
        0,
      );
      const lotteryTicket = lotteryTickets.reduce(
        (acc, lotteryTicket) => acc + lotteryTicket.amount,
        0,
      );
      const inPlatform = income - withdrawal;
      const balance = inPlatform - lotteryTicket;

      return {
        income,
        withdrawal,
        lotteryTicket,
        inPlatform,
        balance,
      };
    } catch (e) {
      throw e;
    }
  }
}
