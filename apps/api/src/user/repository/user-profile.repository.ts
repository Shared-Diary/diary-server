import { Injectable } from '@nestjs/common';
import { Prisma, UserProfile } from '@prisma/client';

import { PrismaService } from '@app/prisma';
import { PrismaOmitCreateAndUpdateType } from '@app/prisma/type';

@Injectable()
export class UserProfileRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(
    profile: PrismaOmitCreateAndUpdateType<Prisma.UserProfileUncheckedCreateInput>,
  ) {
    return this.prismaService.userProfile.create({
      data: profile,
    });
  }

  findByUnique(
    userProfileWhereUniqueInput: Prisma.UserProfileWhereUniqueInput,
  ): Promise<UserProfile | null> {
    return this.prismaService.userProfile.findUnique({
      where: userProfileWhereUniqueInput,
    });
  }
}
