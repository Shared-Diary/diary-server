import { Injectable } from '@nestjs/common';
import { Diary, Prisma } from '@prisma/client';

import { PrismaCreateAndUpdateType } from '@app/prisma/type';
import { getKSTDate } from '@app/utils/date';
import { PrismaService } from '@app/prisma';

@Injectable()
export class DiaryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(
    diary: PrismaCreateAndUpdateType<Prisma.DiaryUncheckedCreateInput>,
  ): Promise<Diary> {
    return this.prismaService.diary.create({
      data: {
        createdAt: getKSTDate(),
        updatedAt: getKSTDate(),
        ...diary,
      },
    });
  }

  getCountBetweenDatesByUser({
    userId,
    startDate,
    endDate,
  }: {
    userId: number;
    startDate: Date;
    endDate: Date;
  }) {
    return this.prismaService.diary.count({
      where: {
        createdAt: {
          lt: endDate,
          gte: startDate,
        },
        userId,
        status: true,
      },
    });
  }

  getListIncludeLiekAndImage({
    page,
    pageSize,
  }: {
    page: number;
    pageSize: number;
  }) {
    return this.prismaService.diary.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        diaryImage: true,
        diaryLike: true,
      },
    });
  }
}
