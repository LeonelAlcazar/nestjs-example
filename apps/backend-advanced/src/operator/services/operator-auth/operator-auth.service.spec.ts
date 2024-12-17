import { Test, TestingModule } from '@nestjs/testing';
import { OperatorAuthService } from './operator-auth.service';

describe('OperatorAuthService', () => {
  let service: OperatorAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OperatorAuthService],
    }).compile();

    service = module.get<OperatorAuthService>(OperatorAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
