import { Test, TestingModule } from '@nestjs/testing';
import { OperatorAuthController } from './operator-auth.controller';

describe('OperatorAuthController', () => {
  let controller: OperatorAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperatorAuthController],
    }).compile();

    controller = module.get<OperatorAuthController>(OperatorAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
