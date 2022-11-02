import { Prisma } from '@prisma/client';
import { UsersEntity } from '../entity';

export abstract class UsersService {
  abstract createUser(user: Prisma.UsersUncheckedCreateInput): Promise<void>;

  abstract findUserByEmail(email: string): Promise<UsersEntity>;
}
