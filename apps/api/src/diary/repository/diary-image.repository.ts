import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaType } from '@app/prisma/type';

@Injectable()
export class DiaryImageRepository {
  createImages(
    prisma: PrismaType,
    diaryImages: Prisma.DiaryImageUncheckedCreateInput[],
  ) {
    return prisma.diaryImage.createMany({
      data: diaryImages,
    });
  }
}
