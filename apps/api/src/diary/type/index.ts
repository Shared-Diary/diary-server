import { Diary, DiaryImage, DiaryLike } from '@prisma/client';

export type GetDiaryIncludeImageAndLikeType = Diary & {
  diaryImage: DiaryImage[];
  diaryLike: DiaryLike[];
};
