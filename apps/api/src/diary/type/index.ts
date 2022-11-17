import { PrismaType } from '@app/prisma/type';

export interface CreateDiaryImagesType {
  diaryId: number;
  diaryImageFiles: Express.Multer.File[];
  prisma: PrismaType;
}
