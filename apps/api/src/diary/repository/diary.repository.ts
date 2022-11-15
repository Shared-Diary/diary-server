import { Injectable } from '@nestjs/common';
import { Diary, Prisma } from '@prisma/client';

import { PrismaType } from '@app/prisma/type';

@Injectable()
export class DiaryRepository {
  create(
    prisma: PrismaType,
    diary: Prisma.DiaryUncheckedCreateInput,
  ): Promise<Diary> {
    return prisma.diary.create({
      data: diary,
    });
  }
}
