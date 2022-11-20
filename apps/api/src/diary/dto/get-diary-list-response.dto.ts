import { ApiProperty } from '@nestjs/swagger';

import { DiaryEntity, DiaryImageEntity } from '../entity';

export class DiaryIncludeImagesAndLikeCount extends DiaryEntity {
  @ApiProperty({ type: [DiaryImageEntity] })
  diaryImage: DiaryImageEntity[];

  @ApiProperty()
  diaryLikeCount: number;
}

export class GetDiaryListResponseDto {
  @ApiProperty({ type: [DiaryIncludeImagesAndLikeCount], nullable: true })
  readonly diaries: DiaryIncludeImagesAndLikeCount[] | null;

  @ApiProperty()
  readonly total: number;

  constructor(partial: Partial<GetDiaryListResponseDto>) {
    Object.assign(this, partial);
  }
}
