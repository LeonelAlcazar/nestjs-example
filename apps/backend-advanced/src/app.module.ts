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
import * as Joi from 'joi';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisModule } from '@nestjs-modules/ioredis';
import { CcacheModule } from './ccache/ccache.module';
import { ScheduleModule } from '@nestjs/schedule';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({}),
        new winston.transports.File({
          filename: 'combined.log',
        }),
      ],
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
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
    RedisModule.forRootAsync({
      inject: [configuration.KEY],
      useFactory: (configService: ConfigType<typeof configuration>) => ({
        type: 'single',
        options: {
          host: configService.redis.host,
          port: configService.redis.port,
          password: configService.redis.password,
        },
      }),
    }),

    CommonModule,
    JwtModule.registerAsync({
      global: true,
      inject: [configuration.KEY],
      useFactory: (configService: ConfigType<typeof configuration>) => ({
        secret: configService.jwt.secret,
        signOptions: { expiresIn: configService.jwt.expirationTime },
      }),
    }),
    CacheModule.register({
      isGlobal: true,
      max: 10000,
    }),
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          inject: [configuration.KEY],
          name: 'NOTIFICATIONS_SERVICE',
          useFactory: (configService: ConfigType<typeof configuration>) => /* {
            transport: Transport.KAFKA,
            options: {
              client: {
                brokers: [configService.kafka.broker],
                clientId: configService.kafka.clientId + '-producer',
              },
            },
          } */ ({
            transport: Transport.REDIS,
            options: {
              host: configService.redis.host,
              port: configService.redis.port,
              password: configService.redis.password,
            },
          }),
        },
      ],
    }),
    /* CacheModule.registerAsync({
      inject: [configuration.KEY],
      useFactory: async (configService: ConfigType<typeof configuration>) => {
        const store = await redisStore({
          socket: {
            host: configService.redis.host,
            port: configService.redis.port,
          },
          password: configService.redis.password,
        });

        return {
          store,
          isGlobal: true,
          ttl: 1000 * 60 * 60,
        };
      },
    }), */
    OperatorModule,
    UserModule,
    LotteryModule,
    CcacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
