import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Income } from '../../entities/income.entity';
import { Repository } from 'typeorm';
import { Withdrawal, WithdrawalStatus } from '../../entities/withdrawal.entity';
import { LotteryTicket } from 'src/lottery/entities/lottery-ticket.entity';
import { UserService } from 'src/user/services/user/user.service';
import { OperatorService } from 'src/operator/services/operator/operator.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Income)
    private incomeRepository: Repository<Income>,
    @InjectRepository(Withdrawal)
    private withdrawalRepository: Repository<Withdrawal>,
    @InjectRepository(LotteryTicket)
    private lotteryTicketRepository: Repository<LotteryTicket>,
    private userService: UserService,
    private operatorService: OperatorService,
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
          status: WithdrawalStatus.APPROVED,
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

  async addIncome(
    userId: string,
    amount: number,
    operatorId?: string,
  ): Promise<Income> {
    try {
      const user = await this.userService.findOne({
        id: userId,
      });

      const income = new Income();
      income.user = user;
      income.userId = user.id;
      income.amount = amount;
      income.operatorId = operatorId;

      return await this.incomeRepository.save(income);
    } catch (e) {
      throw e;
    }
  }

  async requestWithdrawal(userId: string, amount: number): Promise<Withdrawal> {
    try {
      const balance = await this.getUserBalance(userId);
      if (balance.balance < amount) {
        throw new ConflictException('Insufficient balance');
      }

      const withdrawal = new Withdrawal();
      withdrawal.userId = userId;
      withdrawal.amount = amount;
      withdrawal.status = WithdrawalStatus.PENDING;

      return await this.withdrawalRepository.save(withdrawal);
    } catch (e) {
      throw e;
    }
  }

  async changeWithdrawalStatus(
    withdrawalId: string,
    status: WithdrawalStatus,
    operatorId?: string,
  ): Promise<Withdrawal> {
    try {
      const withdrawal = await this.withdrawalRepository.findOne({
        where: {
          id: withdrawalId,
        },
      });

      if (!withdrawal) {
        throw new NotFoundException('Withdrawal not found');
      }

      if (withdrawal.status !== WithdrawalStatus.PENDING) {
        throw new ForbiddenException('Withdrawal status cannot be changed');
      }

      withdrawal.status = status;
      withdrawal.operatorId = operatorId;

      return await this.withdrawalRepository.save(withdrawal);
    } catch (e) {
      throw e;
    }
  }
}
