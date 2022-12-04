import { Injectable } from '@nestjs/common';

import { PrismaService } from '@app/prisma';
import { PrismaCreateAndUpdateType } from '@app/prisma/type';

import { UserProfileEntity } from '../entity';

@Injectable()
export class UserProfileRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(userProfile: PrismaCreateAndUpdateType<UserProfileEntity>) {
    return this.prismaService.userProfile.create({
      data: userProfile,
    });
  }
}
