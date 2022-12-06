import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { UserService } from './user.service';
import { UserProfileRepository, UserRepository } from '../repository';
import {
  CanNotCreatedUserProfileException,
  DuplicateEmailException,
  NotFoundUserException,
} from '../exception';
import { UserEntity } from '../entity';
import { GetUserProfileResponseDto } from '../dto/responses';
import { CreateUserProfileRequestDto } from '../dto/requests';

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userProfileRepository: UserProfileRepository,
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

  async findUserWithProfile(
    userId: number,
  ): Promise<GetUserProfileResponseDto> {
    const user = await this.userRepository.findWithProfile(userId);

    if (!user || !user.status) {
      throw new NotFoundUserException();
    }

    return new GetUserProfileResponseDto(user);
  }

  async createUserProfile(
    userId: number,
    dto: CreateUserProfileRequestDto,
  ): Promise<void> {
    await this.validateIsCreated(userId);

    const { nickName, introduce } = dto;

    await this.userProfileRepository.create({
      userId,
      nickName,
      introduce,
    });
  }

  private async validateIsCreated(userId: number) {
    const userProfile = await this.userProfileRepository.getByUser(userId);
    if (userProfile) {
      throw new CanNotCreatedUserProfileException();
    }
  }
}
