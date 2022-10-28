import { Test, TestingModule } from '@nestjs/testing';

import { UsersService, UsersServiceImpl } from '../service';
import { UsersController } from '../controller';
import { UsersRepository } from '../repository';
import { DuplicateEmailException } from '../exception';

type Mock<T = any> = Partial<Record<keyof T, jest.Mock>>;

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Mock<UsersRepository>;

  const mockUsersRepository = () => ({
    create: jest.fn(),
    findByEmail: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useClass: UsersServiceImpl,
        },
        {
          provide: UsersRepository,
          useFactory: mockUsersRepository,
        },
      ],
    }).compile();

    usersService = await module.get<UsersService>(UsersService);
    usersRepository = await module.get(UsersRepository);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('Create User', () => {
    it('이메일이 존재한다면 Conflict Exception 을 전송한다', async () => {
      usersRepository.findByEmail.mockResolvedValue('data');
      await expect(async () => {
        await usersService.createUser({
          email: 'test@data.com',
          password: 'testpassword',
        });
      }).rejects.toThrow(new DuplicateEmailException());
    });
  });
});
