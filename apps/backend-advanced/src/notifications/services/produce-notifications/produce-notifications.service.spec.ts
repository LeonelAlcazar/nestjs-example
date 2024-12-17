import { Test, TestingModule } from '@nestjs/testing';
import { ProduceNotificationsService } from './produce-notifications.service';

describe('ProduceNotificationsService', () => {
  let service: ProduceNotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProduceNotificationsService],
    }).compile();

    service = module.get<ProduceNotificationsService>(
      ProduceNotificationsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
