import { Injectable } from '@nestjs/common';
import { Diary, Prisma } from '@prisma/client';

import { PrismaCreateAndUpdateType } from '@app/prisma/type';
import { getKSTDate } from '@app/utils/date';
import { PrismaService } from '@app/prisma';
import { WithTotal } from '@app/shared/type';

import { DiaryIncludeImageAndLike } from '../type';

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

  update(
    id: number,
    diary: PrismaCreateAndUpdateType<Prisma.DiaryUncheckedUpdateInput>,
  ) {
    return this.prismaService.diary.update({
      where: {
        id,
      },
      data: {
        updatedAt: getKSTDate(),
        ...diary,
      },
    });
  }

  findDiaryCount(diaryCountArgs: Prisma.DiaryCountArgs) {
    return this.prismaService.diary.count(diaryCountArgs);
  }

  findListIncludeLikeAndImage({
    page,
    pageSize,
  }: {
    page: number;
    pageSize: number;
  }): Promise<WithTotal<DiaryIncludeImageAndLike[]>> {
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

  findById(id: number) {
    return this.prismaService.diary.findUnique({
      where: {
        id,
      },
    });
  }

  findIncludeLikeAndImage(id: number) {
    return this.prismaService.diary.findFirst({
      where: {
        id,
        diaryLike: {
          some: {
            status: true,
          },
        },
      },
      include: {
        diaryImage: true,
        diaryLike: true,
      },
    });
  }

  findByUserIncludeLikeAndImage({
    userId,
    page,
    pageSize,
  }: {
    userId: number;
    page: number;
    pageSize: number;
  }): Promise<WithTotal<DiaryIncludeImageAndLike[]>> {
    const where: Prisma.DiaryWhereInput = {
      status: true,
      userId,
      diaryLike: {
        every: {
          status: true,
        },
      },
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
