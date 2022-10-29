import { Test, TestingModule } from '@nestjs/testing';

import { PasswordEncoderService } from '@app/password-encoder';
import { UsersService, UsersServiceImpl } from '../service';
import { UsersController } from '../controller';
import { UsersRepository } from '../repository';
import { DuplicateEmailException } from '../exception';

type Mock<T = any> = Partial<Record<keyof T, jest.Mock>>;

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Mock<UsersRepository>;
  let passwordEncoderService: PasswordEncoderService;

  const mockUsersRepository = () => ({
    create: jest.fn(),
    findByEmail: jest.fn(),
  });

  const mockPasswordEncoderService = () => ({
    encode: jest.fn(),
    isMatches: jest.fn(),
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
        {
          provide: PasswordEncoderService,
          useFactory: mockPasswordEncoderService,
        },
      ],
    }).compile();

    usersService = await module.get<UsersService>(UsersService);
    usersRepository = await module.get(UsersRepository);
    passwordEncoderService = await module.get<PasswordEncoderService>(
      PasswordEncoderService,
    );
  });

  describe('Create User', () => {
    it('Success', async () => {
      const result = await usersService.createUser({
        email: 'test@test.com',
        password: 'testPassword',
      });

      expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);
      expect(passwordEncoderService.encode).toHaveBeenCalledTimes(1);
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
});
