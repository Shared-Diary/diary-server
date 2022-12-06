import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { UsersService } from './users.service';
import { UsersRepository } from '../repository';
import { DuplicateEmailException, NotFoundUserException } from '../exception';
import { UserEntity } from '../entity';
import { GetUserProfileResponseDto } from '../dto';

@Injectable()
export class UsersServiceImpl implements UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser({
    email,
    password,
  }: Prisma.UserUncheckedCreateInput): Promise<void> {
    await this.validateIsExistEmail(email);

    try {
      await this.usersRepository.create({
        email,
        password,
      });
    } catch (error) {
      throw new InternalServerErrorException({ message: error });
    }
  }

  private async validateIsExistEmail(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);
    if (user) {
      throw new DuplicateEmailException();
    }
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundUserException();
    }

    return user;
  }

  async findUserWithProfile(
    userId: number,
  ): Promise<GetUserProfileResponseDto> {
    const user = await this.usersRepository.findWithProfile(userId);

    if (!user || !user.status) {
      throw new NotFoundUserException();
    }

    return new GetUserProfileResponseDto(user);
  }
}
