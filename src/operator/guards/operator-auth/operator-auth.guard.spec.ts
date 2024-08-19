import { OperatorAuthGuard } from './operator-auth.guard';

describe('OperatorAuthGuard', () => {
  it('should be defined', () => {
    expect(new OperatorAuthGuard()).toBeDefined();
  });
});
