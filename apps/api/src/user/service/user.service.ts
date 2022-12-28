import { Prisma } from '@prisma/client';

import { UserEntity } from '../entity';
import { CreateUserProfileDto } from '../dto/requests';
import { UserWithProfile } from '../type';

export abstract class UserService {
  abstract createUser(user: Prisma.UserUncheckedCreateInput): Promise<void>;

  abstract findUserByEmail(email: string): Promise<UserEntity>;

  abstract findUserWithProfile(userId: number): Promise<UserWithProfile>;

  abstract createUserProfile(
    dto: CreateUserProfileDto,
    userId: number,
    profileImageFile?: Express.Multer.File,
  ): Promise<void>;
}
