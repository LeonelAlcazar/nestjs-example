import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { OperatorModule } from './operator/operator.module';
import { UserModule } from './user/user.module';
import { LotteryModule } from './lottery/lottery.module';
import { CommonModule } from './common/common.module';
import configuration from './config/configuration';
import Joi from 'joi';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        BCRYPT_SALT_OR_ROUNDS: Joi.number().default(10),
        DEFAULT_OPERATOR_EMAIL: Joi.string().required(),
        DEFAULT_OPERATOR_PASSWORD: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    OperatorModule,
    UserModule,
    LotteryModule,
    CommonModule,
    JwtModule.registerAsync({
      global: true,
      inject: [configuration.KEY],
      useFactory: (configService: ConfigType<typeof configuration>) => ({
        secret: configService.jwt.secret,
        signOptions: { expiresIn: configService.jwt.expirationTime },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
