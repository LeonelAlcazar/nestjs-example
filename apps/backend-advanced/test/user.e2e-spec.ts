import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { OperatorModule } from 'src/operator/operator.module';
import { UserAuth } from 'src/user/entities/user-auth.entity';
import { User } from 'src/user/entities/user.entity';
import { WalletModule } from 'src/user/wallet/wallet.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisModule } from '@nestjs-modules/ioredis';
import { Repository } from 'typeorm';
import { OperatorService } from 'src/operator/services/operator/operator.service';
import { Operator } from 'src/operator/entities/operator.entity';
import { OperatorAuth } from 'src/operator/entities/operator-auth.entity';
import { OperatorAuthService } from 'src/operator/operator-auth/services/operator-auth.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let userAuthRepository: Repository<UserAuth>;
  let operatorService: OperatorService;
  let operatorRepository: Repository<Operator>;
  let operatorAuthRepository: Repository<OperatorAuth>;
  let jwt: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
          envFilePath: ['.env.test'],
        }),
        JwtModule.registerAsync({
          global: true,
          inject: [configuration.KEY],
          useFactory: (configService: ConfigType<typeof configuration>) => ({
            secret: configService.jwt.secret,
          }),
        }),
        TypeOrmModule.forRootAsync({
          inject: [configuration.KEY],
          useFactory: (configService: ConfigType<typeof configuration>) => ({
            type: 'postgres',
            host: configService.database.host,
            database: configService.database.name,
            username: configService.database.username,
            password: configService.database.password,
            port: configService.database.port,
            autoLoadEntities: true,
            entities: ['**/*.entity.ts'],
            synchronize: true,
          }),
        }),
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
        CacheModule.register({
          isGlobal: true,
          max: 10000,
        }),
        WalletModule,
        CommonModule,
        OperatorModule,
        UserModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    userRepository = moduleFixture.get('UserRepository');
    userAuthRepository = moduleFixture.get('UserAuthRepository');
    operatorRepository = moduleFixture.get('OperatorRepository');
    operatorAuthRepository = moduleFixture.get('OperatorAuthRepository');

    await operatorAuthRepository.delete({});
    await operatorRepository.delete({});

    operatorService = moduleFixture.get(OperatorService);
    const operatorAuthService = moduleFixture.get(OperatorAuthService);

    await operatorService.register({
      name: 'Test admin',
      email: 'operatortest@gmail.com',
      password: '123456',
    });

    const res = await operatorAuthService.login(
      'operatortest@gmail.com',
      '123456',
    );
    jwt = res.access_token;
    await app.init();
  });

  it('its defined', () => {
    expect(app).toBeDefined();
  });

  describe('/user (GET)', () => {
    beforeAll(async () => {
      await userRepository.save([
        userRepository.create({
          name: 'User list 1',
          email: 'userlist1@gmail.com',
        }),
        userRepository.create({
          name: 'User list 2',
          email: 'userlist2@gmail.com',
        }),
      ]);
    });

    it('Deberia retornar un array de usuarios y el total en la base de datos', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/user')
        .set('Authorization', 'Bearer ' + jwt)
        .expect(200);

      expect(body.total).toBeDefined();
      expect(body.total).toBe(2);
      expect(body.users).toBeDefined();
      expect(body.users).toHaveLength(2);
      expect(body.users).toEqual([
        {
          id: expect.any(String),
          name: 'User list 1',
          email: 'userlist1@gmail.com',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          id: expect.any(String),
          name: 'User list 2',
          email: 'userlist2@gmail.com',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]);
    });
  });

  describe('/user/:id (GET)', () => {
    let id = '';
    beforeAll(async () => {
      const user = await userRepository.save(
        userRepository.create({
          name: 'User exist 1',
          email: 'exist@gmail.com',
        }),
      );

      id = user.id;
    });

    it('Deberia devolver el usuario con su id', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/user/' + id)
        .expect(200);

      expect(body).toEqual({
        id: id,
        name: 'User exist 1',
        email: 'exist@gmail.com',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('Deberia devolver un error 404', async () => {
      return request(app.getHttpServer()).get('/user/inventado').expect(404);
    });
  });

  describe('/user (POST)', () => {
    beforeAll(async () => {
      await userRepository.save(
        userRepository.create({
          name: 'user test',
          email: 'used@gmail.com',
        }),
      );
    });

    it('Deberia registrar un nuevo usuario', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/user')
        .send({
          name: 'Nuevo usuario',
          email: 'nuevo@gmail.com',
          password: '123456',
        })
        .expect(201);

      expect(body).toEqual({
        id: expect.any(String),
        name: 'Nuevo usuario',
        email: 'nuevo@gmail.com',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('Deberia devolver un error 409', () => {
      return request(app.getHttpServer())
        .post('/user')
        .send({
          name: 'Nuevo usuario',
          email: 'used@gmail.com',
          password: '123456',
        })
        .expect(409);
    });
  });

  afterAll(async () => {
    await userAuthRepository.delete({});
    await userRepository.delete({});
    await operatorAuthRepository.delete({});
    await operatorRepository.delete({});
    await app.close();
  });
});
