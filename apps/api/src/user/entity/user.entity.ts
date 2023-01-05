import { User } from '@prisma/client';

export class UserEntity implements User {
  id: number;

  createdAt: Date;

  updatedAt: Date;

  status: boolean;

  email: string;

  password: string;
}
