import { Injectable } from '@nestjs/common';
import { DiaryLike, Prisma } from '@prisma/client';

import { PrismaService } from '@app/prisma';
import { PrismaOmitCreateAndUpdateType } from '@app/prisma/type';
import { WithTotal } from '@app/shared/type';

import { DiaryLikeWithUserProfile } from '../type';

@Injectable()
export class DiaryLikeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(
    diaryLike: PrismaOmitCreateAndUpdateType<Prisma.DiaryLikeUncheckedCreateInput>,
  ) {
    return this.prismaService.diaryLike.create({
      data: diaryLike,
    });
  }

  update(
    id: number,
    diaryLike: PrismaOmitCreateAndUpdateType<Prisma.DiaryLikeUncheckedUpdateInput>,
  ) {
    return this.prismaService.diaryLike.update({
      where: {
        id,
      },
      data: diaryLike,
    });
  }

  findUserLike(diaryId: number, userId: number): Promise<DiaryLike | null> {
    return this.prismaService.diaryLike.findUnique({
      where: {
        userId_diaryId: {
          userId,
          diaryId,
        },
      },
    });
  }

  findListByDiaryId({
    diaryId,
    page,
    pageSize,
  }: {
    diaryId: number;
    page: number;
    pageSize: number;
  }): Promise<WithTotal<DiaryLikeWithUserProfile[]>> {
    const where: Prisma.DiaryLikeWhereInput = {
      diaryId,
      status: true,
    };

    return this.prismaService.$transaction([
      this.prismaService.diaryLike.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        include: {
          user: {
            include: {
              userProfile: true,
            },
          },
        },
      }),
      this.prismaService.diaryLike.count({
        where,
      }),
    ]);
  }
}
