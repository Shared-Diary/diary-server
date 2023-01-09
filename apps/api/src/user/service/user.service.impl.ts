import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { UploadFileService } from '@app/upload-file';

import { UserService } from './user.service';
import { UserProfileRepository, UserRepository } from '../repository';
import {
  AlreadyCreatedProfileException,
  DuplicateEmailException,
  NotFoundUserException,
} from '../exception';
import { UserEntity } from '../entity';
import { CreateUserProfileDto } from '../dto/requests';
import { UserWithProfile } from '../type';

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly uploadFileService: UploadFileService,
  ) {}

  async createUser({
    email,
    password,
  }: Prisma.UserUncheckedCreateInput): Promise<void> {
    await this.validateIsExistEmail(email);

    try {
      await this.userRepository.create({
        email,
        password,
      });
    } catch (error) {
      throw new InternalServerErrorException({ message: error });
    }
  }

  private async validateIsExistEmail(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (user) {
      throw new DuplicateEmailException();
    }
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundUserException();
    }

    return user;
  }

  async findUserWithProfile(userId: number): Promise<UserWithProfile> {
    const user = await this.userRepository.findWithProfile(userId);

    if (!user || !user.status) {
      throw new NotFoundUserException();
    }

    return user;
  }

  async createUserProfile(
    { nickName, introduce }: CreateUserProfileDto,
    userId: number,
    profileImageFile?: Express.Multer.File,
  ): Promise<void> {
    await this.validateUserCreatedProfile(userId);

    const profileImageUrl = profileImageFile
      ? await this.uploadFileService.getUploadedImageUrl(profileImageFile)
      : null;

    await this.userProfileRepository.create({
      nickName,
      introduce,
      profileUrl: profileImageUrl,
      userId,
    });
  }

  private async validateUserCreatedProfile(userId: number) {
    const userProfile = await this.userProfileRepository.findByUnique({
      userId,
    });
    if (userProfile) {
      throw new AlreadyCreatedProfileException();
    }
  }
}
