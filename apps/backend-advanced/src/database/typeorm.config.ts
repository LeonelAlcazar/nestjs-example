import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DATABASE_HOST'),
  port: configService.get('DATABASE_PORT'),
  username: configService.get('DATABASE_USERNAME'),
  password: configService.get('DATABASE_PASSWORD'),
  database: configService.get('DATABASE_NAME'),
  entities: [
    path.resolve(__dirname, '..') + '/**/entities/*.ts',
    path.resolve(__dirname, '..') + '/**/entities/*.js',
  ],
  migrations: [
    path.resolve(__dirname, '..') + '/**/migrations/*.ts',
    path.resolve(__dirname, '..') + '/**/migrations/*.js',
  ],
  migrationsTableName: 'migrations',
});
