import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'src/common/types/pagination.type';
import { LotteryCreateDTO } from 'src/lottery/dtos/lottery-create.dto';
import { LotteryTicket } from 'src/lottery/entities/lottery-ticket.entity';
import { Lottery, LotteryStatus } from 'src/lottery/entities/lottery.entity';
import { WalletService } from 'src/user/wallet/services/wallet/wallet.service';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class LotteryService {
  constructor(
    @InjectRepository(Lottery)
    private lotterRepository: Repository<Lottery>,
    @InjectRepository(LotteryTicket)
    private lotteryTicketRepository: Repository<LotteryTicket>,
    private walletService: WalletService,
  ) {}

  async findAll(criteria: FindOptionsWhere<Lottery>, pagination: Pagination) {
    const [lotteries, count] = await this.lotterRepository.findAndCount({
      where: criteria,
      take: pagination.limit,
      skip: (pagination.page - 1) * pagination.limit,
    });

    return {
      lotteries,
      count,
    };
  }

  async findOne(criteria: FindOptionsWhere<Lottery>) {
    try {
      return this.lotterRepository.findOneOrFail({ where: criteria });
    } catch (e) {
      throw new NotFoundException('Lottery not found');
    }
  }

  async create(data: LotteryCreateDTO, operatorId?: string) {
    try {
      const lottery = new Lottery();

      lottery.endAt = data.endAt;
      lottery.createdByOperatorId = operatorId;
      lottery.status = LotteryStatus.OPEN;

      return this.lotterRepository.save(lottery);
    } catch (e) {}
  }

  async executeLottery(lotteryId: string) {
    try {
      const lottery = await this.findOne({
        id: lotteryId,
        status: LotteryStatus.OPEN,
      });

      lottery.status = LotteryStatus.CLOSED;
      const winningNumber = this.generateWinningNumber();
      lottery.winningNumber = winningNumber;

      const lotteryTickets = await this.lotteryTicketRepository.find({
        where: {
          lotteryId,
        },
      });

      const prize = lotteryTickets.reduce((acc, ticket) => {
        return acc + ticket.amount;
      }, 0);

      const winners = lotteryTickets.filter((ticket) => {
        return ticket.number === winningNumber;
      });

      const totalWinnersAmount = winners.reduce((acc, winner) => {
        return acc + winner.amount;
      }, 0);

      for (let winner of winners) {
        const amount = (winner.amount / totalWinnersAmount) * prize;
        await this.walletService.addIncome(winner.userId, amount);
      }

      return this.lotterRepository.save(lottery);
    } catch (e) {
      throw e;
    }
  }

  private generateWinningNumber() {
    const numbers = [];
    while (numbers.length < 5) {
      const number = Math.floor(Math.random() * 11);
      if (!numbers.includes(number)) {
        numbers.push(number < 10 ? `0${number}` : `${number}`);
      }
    }

    return numbers.join('');
  }
}
