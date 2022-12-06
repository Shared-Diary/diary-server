import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { PrismaService } from '@app/prisma';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(user: Prisma.UserUncheckedCreateInput) {
    return this.prismaService.user.create({
      data: user,
    });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  findWithProfile(id: number) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        userProfile: true,
      },
    });
  }
}
