import { DiaryImage } from '@prisma/client';

export class DiaryImageEntity implements DiaryImage {
  id: number;

  createdAt: Date;

  updatedAt: Date;

  diaryId: number;

  imageUrl: string;
}
