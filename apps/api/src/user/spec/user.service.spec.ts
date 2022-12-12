import { Test, TestingModule } from '@nestjs/testing';

import { Mock } from '@app/shared/type';
import { UploadFileService } from '@app/upload-file';

import { UserService, UserServiceImpl } from '../service';
import { UserController } from '../controller';
import { UserProfileRepository, UserRepository } from '../repository';
import {
  AlreadyCreatedProfileException,
  DuplicateEmailException,
  NotFoundUserException,
} from '../exception';
import ThrottlerModule from '../../configs/modules/throttler.module';
import { UserWithProfile } from '../type';
import { GetUserProfileResponseDto } from '../dto/responses';

describe('UsersService', () => {
  let userService: UserService;
  let userRepository: Mock<UserRepository>;
  let userProfileRepository: Mock<UserProfileRepository>;
  let uploadFileService: Mock<UploadFileService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ThrottlerModule],
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useClass: UserServiceImpl,
        },
        {
          provide: UserRepository,
          useFactory: () => ({
            create: jest.fn(),
            findByEmail: jest.fn(),
            findWithProfile: jest.fn(),
          }),
        },
        {
          provide: UserProfileRepository,
          useFactory: () => ({
            getByUserId: jest.fn(),
            create: jest.fn(),
          }),
        },
        {
          provide: UploadFileService,
          useFactory: () => ({
            getUploadedImageUrl: jest.fn(),
          }),
        },
      ],
    }).compile();

    userService = await module.get<UserService>(UserService);
    uploadFileService = module.get(UploadFileService);
    userRepository = await module.get(UserRepository);
    userProfileRepository = await module.get(UserProfileRepository);
  });

  describe('createUser', () => {
    it('유저 생성 성공', async () => {
      const result = await userService.createUser({
        email: 'test@test.com',
        password: 'testPassword',
      });

      expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it('이메일이 존재한다면 Conflict Exception 을 전송한다', async () => {
      userRepository.findByEmail.mockResolvedValue('data');
      await expect(async () => {
        await userService.createUser({
          email: 'test@data.com',
          password: 'testpassword',
        });
      }).rejects.toThrow(new DuplicateEmailException());
    });
  });

  describe('findUserByEmail', () => {
    it('유저가 존재하지 않는다면 Not Found Exception 을 전송한다', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      await expect(async () => {
        await userService.findUserByEmail('email@email.com');
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
      userRepository.findWithProfile.mockResolvedValue(mockValue);

      const result = await userService.findUserWithProfile(1);

      expect(userRepository.findWithProfile).toHaveBeenCalledTimes(1);
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
      userRepository.findWithProfile.mockResolvedValue(mockValue);

      const result = await userService.findUserWithProfile(1);

      expect(result.introduce).toBeNull();
      expect(result.nickName).toBeNull();
      expect(result.profileImageUrl).toBeNull();
    });

    it('user 정보가 없을 경우 NotFoundUserException 반환한다', async () => {
      userRepository.findWithProfile.mockResolvedValue(null);

      await expect(async () => {
        await userService.findUserWithProfile(1);
      }).rejects.toThrow(new NotFoundUserException());
    });

    it('user 의 status 값이 false 인 경우 NotFoundUserException 을 반환한다', async () => {
      userRepository.findWithProfile.mockResolvedValue({ status: false });

      await expect(async () => {
        await userService.findUserWithProfile(1);
      }).rejects.toThrow(new NotFoundUserException());
    });
  });

  describe('Create User Profile', () => {
    it('유저 프로필 생성 성공', async () => {
      userProfileRepository.getByUserId.mockResolvedValue(null);
      uploadFileService.getUploadedImageUrl.mockResolvedValue('imageUrl');

      const result = await userService.createUserProfile(
        {
          nickName: 'nickName',
          introduce: 'introduce',
        },
        1,
        {} as Express.Multer.File,
      );

      expect(result).toBeUndefined();
      expect(uploadFileService.getUploadedImageUrl).toHaveBeenCalledTimes(1);
      expect(userProfileRepository.getByUserId).toHaveBeenCalledTimes(1);
      expect(userProfileRepository.create).toHaveBeenCalledTimes(1);
    });

    it('이미 프로필이 생성되었다면 AlreadyCreatedProfileException 을 반환한다', async () => {
      userProfileRepository.getByUserId.mockResolvedValue('data');

      await expect(async () => {
        await userService.createUserProfile(
          {
            nickName: 'nickName',
            introduce: 'introduce',
          },
          1,
          {} as Express.Multer.File,
        );
      }).rejects.toThrow(new AlreadyCreatedProfileException());
    });
  });
});
