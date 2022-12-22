import { Injectable } from '@nestjs/common';
import { DiaryLike, Prisma } from '@prisma/client';

import { PrismaService } from '@app/prisma';
import { PrismaCreateAndUpdateType } from '@app/prisma/type';

@Injectable()
export class DiaryLikeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(
    diaryLike: PrismaCreateAndUpdateType<Prisma.DiaryLikeUncheckedCreateInput>,
  ) {
    return this.prismaService.diaryLike.create({
      data: diaryLike,
    });
  }

  update(
    id: number,
    diaryLike: PrismaCreateAndUpdateType<Prisma.DiaryLikeUncheckedUpdateInput>,
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
}
