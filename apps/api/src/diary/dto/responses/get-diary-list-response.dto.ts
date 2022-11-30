import { DiaryEntity, DiaryImageEntity } from '../../entity';

export class DiaryIncludeImagesAndLikeCount extends DiaryEntity {
  image: DiaryImageEntity[];

  likeCount: number;
}

export class GetDiaryListResponseDto {
  readonly diaries: DiaryIncludeImagesAndLikeCount[] | null;

  readonly total: number;

  constructor(partial: Partial<GetDiaryListResponseDto>) {
    Object.assign(this, partial);
  }
}
