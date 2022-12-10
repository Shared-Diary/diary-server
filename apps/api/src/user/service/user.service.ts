import { Prisma } from '@prisma/client';

import { UserEntity } from '../entity';
import { GetUserProfileResponseDto } from '../dto/responses';
import { CreateUserProfileDto } from '../dto/requests';

export abstract class UserService {
  abstract createUser(user: Prisma.UserUncheckedCreateInput): Promise<void>;

  abstract findUserByEmail(email: string): Promise<UserEntity>;

  abstract findUserWithProfile(
    userId: number,
  ): Promise<GetUserProfileResponseDto>;

  abstract createUserProfile(
    dto: CreateUserProfileDto,
    userId: number,
    profileImageFile?: Express.Multer.File,
  ): Promise<void>;
}
