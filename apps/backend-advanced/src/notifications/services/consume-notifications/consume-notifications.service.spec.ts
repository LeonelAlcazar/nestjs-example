import { Test, TestingModule } from '@nestjs/testing';
import { ConsumeNotificationsService } from './consume-notifications.service';

describe('ConsumeNotificationsService', () => {
  let service: ConsumeNotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsumeNotificationsService],
    }).compile();

    service = module.get<ConsumeNotificationsService>(ConsumeNotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
