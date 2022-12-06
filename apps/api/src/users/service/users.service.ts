import { Prisma } from '@prisma/client';

import { UserEntity } from '../entity';
import { GetUserProfileResponseDto } from '../dto';

export abstract class UsersService {
  abstract createUser(user: Prisma.UserUncheckedCreateInput): Promise<void>;

  abstract findUserByEmail(email: string): Promise<UserEntity>;

  abstract findUserWithProfile(
    userId: number,
  ): Promise<GetUserProfileResponseDto>;
}
