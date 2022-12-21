import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@app/prisma';

@Injectable()
export class DiaryLikeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(diaryLike: Prisma.DiaryLikeUncheckedCreateInput) {
    return this.prismaService.diaryLike.create({
      data: diaryLike,
    });
  }
}
