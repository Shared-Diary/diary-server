import { DiaryEntity, DiaryImageEntity, DiaryLikeEntity } from '../entity';

export type DiaryIncludeImageAndLikeType = DiaryEntity & {
  diaryImage: DiaryImageEntity[];
  diaryLike: DiaryLikeEntity[];
};
