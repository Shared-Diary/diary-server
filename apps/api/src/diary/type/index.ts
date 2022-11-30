import { DiaryEntity, DiaryImageEntity, DiaryLikeEntity } from '../entity';

export type DiaryIncludeImageAndLikeType = DiaryEntity & {
  diaryImage: DiaryImageEntity[];
  diaryLike: DiaryLikeEntity[];
};

export interface GetMyDiaryOptions {
  userId: number;
  page: number;
  pageSize: number;
}
