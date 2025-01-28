import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'src/common/types/pagination.type';
import { LotteryTicketCreateDTO } from 'src/lottery/dtos/lottery-ticket-create.dto';
import { LotteryTicket } from 'src/lottery/entities/lottery-ticket.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { LotteryService } from '../lottery/lottery.service';
import { WalletService } from 'src/user/wallet/services/wallet/wallet.service';

@Injectable()
export class LotteryTicketService {
  constructor(
    @InjectRepository(LotteryTicket)
    private lotteryTicketRepository: Repository<LotteryTicket>,
    private lotteryService: LotteryService,
    private walletService: WalletService,
  ) {}

  async findAll(
    criteria: FindOptionsWhere<LotteryTicket>,
    pagination: Pagination,
  ) {
    const [lotteryTickets, count] =
      await this.lotteryTicketRepository.findAndCount({
        where: criteria,
        take: pagination.limit,
        skip: (pagination.page - 1) * pagination.limit,
        relations: ['lottery'],
      });

    return {
      lotteryTickets,
      count,
    };
  }

  async findOne(criteria: FindOptionsWhere<LotteryTicket>) {
    try {
      return this.lotteryTicketRepository.findOneOrFail({
        where: criteria,
        relations: ['lottery'],
      });
    } catch (e) {
      throw new NotFoundException('Lottery not found');
    }
  }

  async create(data: LotteryTicketCreateDTO, userId: string) {
    try {
      const lotteryTicket = new LotteryTicket();

      const lottery = await this.lotteryService.findOne({ id: data.lotteryId });

      let finalNumber = '';
      const numbers = [];
      for (let i = 0; i < 5; i++) {
        const numberString = data.number[i * 2] + data.number[i * 2 + 1];
        const number = parseInt(numberString);

        if (number < 0 || number > 10 || numbers.includes(number)) {
          throw new BadRequestException('Invalid number');
        }
        numbers.push(number);
        finalNumber += numberString;
      }

      const { balance } = await this.walletService.getUserBalance(userId);

      if (balance < data.amount) {
        throw new ConflictException('Insufficient balance');
      }

      lotteryTicket.amount = data.amount;
      lotteryTicket.number = finalNumber;
      lotteryTicket.userId = userId;
      lotteryTicket.lotteryId = lottery.id;

      return this.lotteryTicketRepository.save(lotteryTicket);
    } catch (e) {
      throw e;
    }
  }
}
