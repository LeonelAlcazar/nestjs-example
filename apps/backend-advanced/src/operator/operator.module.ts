import { Module } from '@nestjs/common';
import { OperatorService } from './services/operator/operator.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operator } from './entities/operator.entity';
import { OperatorAuth } from './entities/operator-auth.entity';
import { OperatorController } from './controllers/operator/operator.controller';
import { OperatorAuthModule } from './operator-auth/operator-auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Operator, OperatorAuth]),
    OperatorAuthModule,
  ],
  providers: [OperatorService],
  exports: [OperatorService],
  controllers: [OperatorController],
})
export class OperatorModule {}
