import { Module } from '@nestjs/common';
import { WalletModule } from './wallet/wallet.module';
import { UserService } from './services/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserAuth } from './entities/user-auth.entity';
import { UserAuthService } from './services/user-auth/user-auth.service';
import { UserController } from './controllers/user/user.controller';
import { CommonModule } from 'src/common/common.module';
import { UserAuthController } from './controllers/user-auth/user-auth.controller';
import { OperatorModule } from 'src/operator/operator.module';
import { ChatGateway } from './gateways/chat/chat.gateway';

@Module({
  imports: [
    WalletModule,
    TypeOrmModule.forFeature([User, UserAuth]),
    CommonModule,
    OperatorModule,
  ],
  providers: [UserService, UserAuthService, ChatGateway],
  exports: [UserService, ChatGateway],
  controllers: [UserController, UserAuthController],
})
export class UserModule {}
