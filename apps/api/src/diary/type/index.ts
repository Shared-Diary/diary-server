import { Diary, DiaryImage, DiaryLike } from '@prisma/client';

export type GetDiaryListIncludeImageAndLikeType = Diary & {
  diaryImage: DiaryImage[];
  diaryLike: DiaryLike[];
};
