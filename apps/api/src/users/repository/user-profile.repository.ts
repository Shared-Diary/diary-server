import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@app/prisma';
import { PrismaCreateAndUpdateType } from '@app/prisma/type';
import { getKSTDate } from '@app/utils';

@Injectable()
export class UserProfileRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(
    userProfile: PrismaCreateAndUpdateType<Prisma.UserProfileUncheckedCreateInput>,
  ) {
    return this.prismaService.userProfile.create({
      data: {
        createdAt: getKSTDate(),
        updatedAt: getKSTDate(),
        ...userProfile,
      },
    });
  }

  getByUser(userId: number) {
    return this.prismaService.userProfile.findUnique({
      where: {
        userId,
      },
    });
  }
}
