import { Test, TestingModule } from '@nestjs/testing';
import { LotteryTicketService } from './lottery-ticket.service';

describe('LotteryTicketService', () => {
  let service: LotteryTicketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LotteryTicketService],
    }).compile();

    service = module.get<LotteryTicketService>(LotteryTicketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
