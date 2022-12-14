import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@app/prisma';
import { PrismaOmitCreateAndUpdateType } from '@app/prisma/type';
import { getKSTDate } from '@app/utils';

import { DiaryImageEntity } from '../entity';

@Injectable()
export class DiaryImageRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(
    diaryImage: PrismaOmitCreateAndUpdateType<Prisma.DiaryImageUncheckedCreateInput>,
  ) {
    return this.prismaService.diaryImage.create({
      data: {
        createdAt: getKSTDate(),
        updatedAt: getKSTDate(),
        ...diaryImage,
      },
    });
  }

  delete(deleteInput: Prisma.DiaryImageWhereUniqueInput) {
    return this.prismaService.diaryImage.delete({
      where: deleteInput,
    });
  }

  findByUnique(
    diaryImageWhereUniqueInput: Prisma.DiaryImageWhereUniqueInput,
  ): Promise<DiaryImageEntity | null> {
    return this.prismaService.diaryImage.findUnique({
      where: diaryImageWhereUniqueInput,
    });
  }
}
