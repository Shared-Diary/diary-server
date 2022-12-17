import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@app/prisma';
import { PrismaCreateAndUpdateType } from '@app/prisma/type';
import { getKSTDate } from '@app/utils';

@Injectable()
export class DiaryImageRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(
    diaryImage: PrismaCreateAndUpdateType<Prisma.DiaryImageUncheckedCreateInput>,
  ) {
    return this.prismaService.diaryImage.create({
      data: {
        createdAt: getKSTDate(),
        updatedAt: getKSTDate(),
        ...diaryImage,
      },
    });
  }
}
