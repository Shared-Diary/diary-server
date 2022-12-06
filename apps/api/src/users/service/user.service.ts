import { Prisma } from '@prisma/client';

import { UserEntity } from '../entity';
import { GetUserProfileResponseDto } from '../dto/responses';
import { CreateUserProfileRequestDto } from '../dto/requests';

export abstract class UserService {
  abstract createUser(user: Prisma.UserUncheckedCreateInput): Promise<void>;

  abstract findUserByEmail(email: string): Promise<UserEntity>;

  abstract findUserWithProfile(
    userId: number,
  ): Promise<GetUserProfileResponseDto>;

  abstract createUserProfile(
    userId: number,
    dto: CreateUserProfileRequestDto,
  ): Promise<void>;
}