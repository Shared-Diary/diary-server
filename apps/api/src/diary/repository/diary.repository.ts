import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaType } from '@app/prisma/type';

@Injectable()
export class DiaryRepository {
  create(prisma: PrismaType, diary: Prisma.DiaryUncheckedCreateInput) {
    return prisma.diary.create({
      data: diary,
    });
  }
}
