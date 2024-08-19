import { Module } from '@nestjs/common';
import { WalletModule } from './wallet/wallet.module';
import { UserService } from './services/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserAuth } from './entities/user-auth.entity';
import { UserAuthService } from './services/user-auth/user-auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import configuration from 'src/config/configuration';
import { ConfigType } from '@nestjs/config';
import { UserController } from './controllers/user/user.controller';

@Module({
  imports: [WalletModule, TypeOrmModule.forFeature([User, UserAuth])],
  providers: [UserService, UserAuthService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
