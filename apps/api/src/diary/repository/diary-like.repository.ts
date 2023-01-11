import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

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

  findByUnique(diaryLikeWhereUniqueInput: Prisma.DiaryLikeWhereUniqueInput) {
    return this.prismaService.diaryLike.findUnique({
      where: diaryLikeWhereUniqueInput,
    });
  }

  findListWithTotal({
    diaryLikeWhereInput,
    page,
    pageSize,
  }: {
    diaryLikeWhereInput: Prisma.DiaryLikeWhereInput;
    page: number;
    pageSize: number;
  }): Promise<WithTotal<DiaryLikeWithUserProfile[]>> {
    return this.prismaService.$transaction([
      this.prismaService.diaryLike.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: diaryLikeWhereInput,
        include: {
          user: {
            include: {
              userProfile: true,
            },
          },
        },
      }),
      this.prismaService.diaryLike.count({
        where: diaryLikeWhereInput,
      }),
    ]);
  }
}
