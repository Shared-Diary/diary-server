import { Test, TestingModule } from '@nestjs/testing';

import { Mock } from '@app/shared/type';

import { UsersService, UsersServiceImpl } from '../service';
import { UsersController } from '../controller';
import { UsersRepository } from '../repository';
import { DuplicateEmailException, NotFoundUserException } from '../exception';

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

  describe('createUser', () => {
    it('유저 생성 성공', async () => {
      const result = await usersService.createUser({
        email: 'test@test.com',
        password: 'testPassword',
      });

      expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

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

  describe('findUserByEmail', () => {
    it('유저가 존재하지 않는다면 Not Found Exception 을 전송한다', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      await expect(async () => {
        await usersService.findUserByEmail('email@email.com');
      }).rejects.toThrow(new NotFoundUserException());
    });
  });
});
