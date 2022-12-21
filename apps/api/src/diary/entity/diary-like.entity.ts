import { DiaryLike } from '@prisma/client';

export class DiaryLikeEntity implements DiaryLike {
  id: number;

  createdAt: Date;

  status: boolean;

  userId: number;

  diaryId: number;
}
