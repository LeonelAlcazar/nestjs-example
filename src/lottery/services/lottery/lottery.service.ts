import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { CronJob } from 'cron';
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
    private schedulerRegistry: SchedulerRegistry,
  ) {
    this.start();
  }

  async start() {
    const lottery = await this.lotterRepository.findOne({
      where: {
        status: LotteryStatus.OPEN,
      },
    });

    if (!lottery) {
      const newLottery = new Lottery();
      newLottery.endAt = new Date();
      newLottery.status = LotteryStatus.OPEN;
      await this.lotterRepository.save(newLottery);
    }
  }

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

  async findOne(criteria: FindOptionsWhere<Lottery>): Promise<Lottery> {
    try {
      const data = await this.lotterRepository.findOneOrFail({
        where: criteria,
      });

      return data;
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

      const date = new Date(data.endAt);
      const dom = date.getDate();
      const month = date.getMonth();
      const hour = date.getHours();
      const minute = date.getMinutes();

      /* this.schedulerRegistry.addCronJob(
        'lottery-' + lottery.id,
        new CronJob(`${minute} ${hour} ${dom} ${month} *`, async () => {
          await this.executeLottery(lottery.id);
          this.schedulerRegistry.getCronJob('lottery-' + lottery.id).stop();
        }),
      ); */

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

  @Cron(CronExpression.EVERY_MINUTE, {
    name: 'automaticCloseLotteries',
  })
  async automaticCloseLotteries() {
    try {
      console.log('Automatic close lotteries');
      const lotteries = await this.lotterRepository.find({
        where: {
          status: LotteryStatus.OPEN,
        },
      });

      for (let lottery of lotteries) {
        try {
          await this.executeLottery(lottery.id);
        } catch (e) {
          Logger.error(e);
          Logger.debug(
            'La loteria con id=' + lottery.id + ' no se pudo cerrar',
          );
        }
      }

      let lottery: Lottery;
      let count = 10;
      while (!lottery && count > 0) {
        try {
          lottery = await this.create({
            endAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
          });
        } catch (e) {
          Logger.error(e);
          Logger.debug('No se pudo crear la loteria, intento ' + (10 - count));
          count--;
        }
      }

      if (!lottery) {
        const job = this.schedulerRegistry.getCronJob(
          'automaticCloseLotteries',
        );

        job.stop();
      }
    } catch (e) {
      Logger.error(e);
    }
  }

  /* @Cron(CronExpression.EVERY_MINUTE)
  async sayHello() {
    console.log('Hello');
  } */
}
