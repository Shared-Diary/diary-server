import { DiaryLike } from '@prisma/client';

export class DiaryLikeEntity implements DiaryLike {
  id: number;

  createdAt: Date;

  userId: number;

  diaryId: number;
}
