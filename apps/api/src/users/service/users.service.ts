import { Prisma } from '@prisma/client';

export abstract class UsersService {
  abstract createUser(user: Prisma.UsersUncheckedCreateInput): Promise<void>;
}
