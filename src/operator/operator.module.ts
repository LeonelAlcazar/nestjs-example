import { Module } from '@nestjs/common';
import { OperatorService } from './services/operator/operator.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operator } from './entities/operator.entity';
import { OperatorAuth } from './entities/operator-auth.entity';
import { OperatorAuthService } from './services/operator-auth/operator-auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Operator, OperatorAuth])],
  providers: [OperatorService, OperatorAuthService],
})
export class OperatorModule {}
