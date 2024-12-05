import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserAuthService } from '../user-auth/user-auth.service';
import { ChatGateway } from 'src/user/gateways/chat/chat.gateway';
import { User } from 'src/user/entities/user.entity';
import { number } from 'joi';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

class MockUserRepository {
  constructor(...args) {}
  findAndCount = jest.fn;
  findOne = jest.fn;
  save = jest.fn;
}

class MockUserAuthService {
  constructor(...args) {}
  generateAuth = jest.fn;
}

class MockChatGateway {
  constructor(...args) {}
  sendMessage = jest.fn;
}

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let userAuthService: MockUserAuthService;
  let chatGateway: ChatGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'UserRepository',
          useClass: MockUserRepository,
        },
        {
          provide: UserAuthService,
          useClass: MockUserAuthService,
        },
        {
          provide: ChatGateway,
          useClass: MockChatGateway,
        },
        UserService,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>('UserRepository');
    userAuthService = module.get<MockUserAuthService>(UserAuthService);
    chatGateway = module.get<ChatGateway>(ChatGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deberia llamar a la funcion findAndCount del repositorio', async () => {
    const repositoryCall = jest
      .spyOn(userRepository, 'findAndCount')
      .mockResolvedValue([[] as User[], 0]);

    const result = await service.findAll(
      {},
      {
        limit: 10,
        page: 1,
      },
    );

    expect(result).toEqual({ users: [], total: 0 });
    expect(repositoryCall).toHaveBeenCalledTimes(1);
    expect(repositoryCall).toHaveBeenCalledWith({
      where: {},
      take: 10,
      skip: 0,
    });
  });

  describe('findOne', () => {
    it('deberia llamar a la funcion findOne del repositorio y sendMessage de chatGateway', async () => {
      const repositoryCall = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue({
          id: '1',
          email: 'email@gmail.com',
          name: 'leo',
        } as User);
      const chatGatewayCall = jest
        .spyOn(chatGateway, 'sendMessage')
        .mockImplementation(() => {});

      const result = await service.findOne({ id: '1' });

      expect(result).toEqual({
        id: '1',
        email: 'email@gmail.com',
        name: 'leo',
      });
      expect(repositoryCall).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(chatGatewayCall).toHaveBeenCalledTimes(1);
    });

    it('findOne deberia devolver un error NotFound', () => {
      const repositoryCall = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(null);
      const chatGatewayCall = jest
        .spyOn(chatGateway, 'sendMessage')
        .mockImplementation(() => {});

      expect(service.findOne({ id: '1' })).rejects.toEqual(
        new NotFoundException('User not found'),
      );
    });
  });
});
