import { Module } from '@nestjs/common';
import { OperatorService } from './services/operator/operator.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operator } from './entities/operator.entity';
import { OperatorAuth } from './entities/operator-auth.entity';
import { OperatorAuthService } from './services/operator-auth/operator-auth.service';
import { OperatorController } from './controllers/operator/operator.controller';
import { OperatorAuthController } from './controllers/operator-auth/operator-auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Operator, OperatorAuth])],
  providers: [OperatorService, OperatorAuthService],
  exports: [OperatorService, OperatorAuthService],
  controllers: [OperatorController, OperatorAuthController],
})
export class OperatorModule {}
