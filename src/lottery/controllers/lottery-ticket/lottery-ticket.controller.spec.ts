import { Test, TestingModule } from '@nestjs/testing';
import { LotteryTicketController } from './lottery-ticket.controller';

describe('LotteryTicketController', () => {
  let controller: LotteryTicketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LotteryTicketController],
    }).compile();

    controller = module.get<LotteryTicketController>(LotteryTicketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
