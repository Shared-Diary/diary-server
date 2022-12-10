import { Injectable } from '@nestjs/common';
import { Prisma, UserProfile } from '@prisma/client';

import { PrismaService } from '@app/prisma';
import { PrismaCreateAndUpdateType } from '@app/prisma/type';

@Injectable()
export class UserProfileRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(
    profile: PrismaCreateAndUpdateType<Prisma.UserProfileUncheckedCreateInput>,
  ) {
    return this.prismaService.userProfile.create({
      data: profile,
    });
  }

  getByUserId(userId: number): Promise<UserProfile | null> {
    return this.prismaService.userProfile.findUnique({
      where: {
        userId,
      },
    });
  }
}
