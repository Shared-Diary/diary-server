import { Prisma } from '@prisma/client';
import { UserEntity } from '../entity';

export abstract class UsersService {
  abstract createUser(user: Prisma.UserUncheckedCreateInput): Promise<void>;

  abstract findUserByEmail(email: string): Promise<UserEntity>;
}
