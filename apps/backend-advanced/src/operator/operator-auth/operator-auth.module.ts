import { Module } from '@nestjs/common';
import { OperatorAuthService } from './services/operator-auth/operator-auth.service';
import { OperatorLocalStrategy } from './strategies/operator-local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operator } from '../entities/operator.entity';
import { OperatorAuth } from '../entities/operator-auth.entity';
import { OperatorAuthController } from './controllers/operator-auth/operator-auth.controller';
import { OperatorJWTStrategy } from './strategies/operator-jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Operator, OperatorAuth])],
  providers: [OperatorAuthService, OperatorLocalStrategy, OperatorJWTStrategy],
  exports: [OperatorAuthService, OperatorLocalStrategy, OperatorJWTStrategy],
  controllers: [OperatorAuthController],
})
export class OperatorAuthModule {}
