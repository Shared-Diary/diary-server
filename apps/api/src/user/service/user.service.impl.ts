import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { UserService } from './user.service';
import { UserRepository } from '../repository';
import { DuplicateEmailException, NotFoundUserException } from '../exception';
import { UserEntity } from '../entity';
import { CreateUserProfileDto } from '../dto/requests';
import { GetUserProfileResponseDto } from '../dto/responses';

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(private readonly userRepository: UserRepository) {}

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
    dto: CreateUserProfileDto,
    profileImageFile: Express.Multer.File,
  ): Promise<void> {}
}
