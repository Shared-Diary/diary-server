import { Injectable } from '@nestjs/common';
import { Prisma, Users } from '@prisma/client';

import { PrismaService } from '@app/prisma';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(user: Prisma.UsersUncheckedCreateInput) {
    return this.prismaService.users.create({
      data: user,
    });
  }

  findByEmail(email: string): Promise<Users | null> {
    return this.prismaService.users.findUnique({
      where: {
        email,
      },
    });
  }
}
