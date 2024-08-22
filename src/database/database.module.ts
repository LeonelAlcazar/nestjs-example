import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import configuration from 'src/config/configuration';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [configuration.KEY],
      useFactory: (configService: ConfigType<typeof configuration>) => {
        console.log(configService.database);
        return <TypeOrmModuleOptions>{
          type: 'postgres',
          database: configService.database.name,
          username: configService.database.username,
          password: configService.database.password,
          host: configService.database.host,
          port: +configService.database.port,
          synchronize: false,
          autoLoadEntities: true,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
