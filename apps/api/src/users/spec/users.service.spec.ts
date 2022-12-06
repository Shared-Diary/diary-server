import { Test, TestingModule } from '@nestjs/testing';

import { Mock } from '@app/shared/type';

import { UsersService, UsersServiceImpl } from '../service';
import { UsersController } from '../controller';
import { UsersRepository } from '../repository';
import { DuplicateEmailException, NotFoundUserException } from '../exception';
import ThrottlerModule from '../../configs/modules/throttler.module';
import { UserWithProfile } from '../type';
import { GetUserProfileResponseDto } from '../dto';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Mock<UsersRepository>;

  const mockUsersRepository = () => ({
    create: jest.fn(),
    findByEmail: jest.fn(),
    findWithProfile: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ThrottlerModule],
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

  describe('findUserProfile', () => {
    it('유저 프로필 조회 성공', async () => {
      const mockValue: UserWithProfile = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: true,
        email: 'email@email.com',
        password: 'password',
        userProfile: {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 1,
          profileUrl: 'profileUrl',
          nickName: 'nickName',
          introduce: 'introduce',
        },
      };
      usersRepository.findWithProfile.mockResolvedValue(mockValue);

      const result = await usersService.findUserWithProfile(1);

      expect(usersRepository.findWithProfile).toHaveBeenCalledTimes(1);
      expect(result instanceof GetUserProfileResponseDto).toBeTruthy();
    });

    it('userProfile 이 없을 경우 관련 값들은 null 이어야 한다', async () => {
      const mockValue: UserWithProfile = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: true,
        email: 'email@email.com',
        password: 'password',
        userProfile: null,
      };
      usersRepository.findWithProfile.mockResolvedValue(mockValue);

      const result = await usersService.findUserWithProfile(1);

      expect(result.introduce).toBeNull();
      expect(result.nickName).toBeNull();
      expect(result.profileImageUrl).toBeNull();
    });

    it('user 정보가 없을 경우 NotFoundUserException 반환한다', async () => {
      usersRepository.findWithProfile.mockResolvedValue(null);

      await expect(async () => {
        await usersService.findUserWithProfile(1);
      }).rejects.toThrow(new NotFoundUserException());
    });

    it('user 의 status 값이 false 인 경우 NotFoundUserException 반환한다', async () => {
      usersRepository.findWithProfile.mockResolvedValue({ status: false });

      await expect(async () => {
        await usersService.findUserWithProfile(1);
      }).rejects.toThrow(new NotFoundUserException());
    });
  });
});
