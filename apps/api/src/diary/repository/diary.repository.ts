import { Injectable } from '@nestjs/common';
import { Diary, Prisma } from '@prisma/client';

import { PrismaType, PrismaCreateType } from '@app/prisma/type';
import { getKSTDate } from '@app/utils/date';

@Injectable()
export class DiaryRepository {
  create(
    prisma: PrismaType,
    diary: PrismaCreateType<Prisma.DiaryUncheckedCreateInput>,
  ): Promise<Diary> {
    return prisma.diary.create({
      data: {
        createdAt: getKSTDate(),
        updatedAt: getKSTDate(),
        ...diary,
      },
    });
  }

  getCountBetweenDatesByUser({
    prisma,
    userId,
    startDate,
    endDate,
  }: {
    prisma: PrismaType;
    userId: number;
    startDate: Date;
    endDate: Date;
  }) {
    return prisma.diary.count({
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
}
