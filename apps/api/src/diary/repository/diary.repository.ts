import { Injectable } from '@nestjs/common';
import { Diary, Prisma } from '@prisma/client';

import { PrismaCreateAndUpdateType } from '@app/prisma/type';
import { getKSTDate } from '@app/utils/date';
import { PrismaService } from '@app/prisma';
import { WithTotal } from '@app/shared/type';

import { DiaryIncludeImageAndLikeType } from '../type';

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

  getListIncludeLikeAndImage({
    page,
    pageSize,
  }: {
    page: number;
    pageSize: number;
  }): Promise<WithTotal<DiaryIncludeImageAndLikeType[]>> {
    const where: Prisma.DiaryWhereInput = {
      status: true,
      isOpen: true,
    };

    return this.prismaService.$transaction([
      this.prismaService.diary.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          diaryImage: true,
          diaryLike: true,
        },
      }),
      this.prismaService.diary.count({
        where,
      }),
    ]);
  }

  getIncludeLikeAndImage(id: number) {
    return this.prismaService.diary.findUnique({
      where: {
        id,
      },
      include: {
        diaryImage: true,
        diaryLike: true,
      },
    });
  }

  getMyIncludeLikeAndImage({
    userId,
    page,
    pageSize,
  }: {
    userId: number;
    page: number;
    pageSize: number;
  }): Promise<WithTotal<DiaryIncludeImageAndLikeType[]>> {
    const where: Prisma.DiaryWhereInput = {
      status: true,
      userId,
    };

    return this.prismaService.$transaction([
      this.prismaService.diary.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          diaryImage: true,
          diaryLike: true,
        },
      }),
      this.prismaService.diary.count({
        where,
      }),
    ]);
  }
}
