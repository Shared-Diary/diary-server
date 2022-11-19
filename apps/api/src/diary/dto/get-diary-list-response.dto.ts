import { ApiProperty } from '@nestjs/swagger';

import { DiaryEntity, DiaryImageEntity } from '../entity';

export class DiaryIncludeImagesAndLikeCount extends DiaryEntity {
  @ApiProperty({ type: [DiaryImageEntity] })
  diaryImage: DiaryImageEntity[];

  @ApiProperty()
  diaryLikeCount: number;
}

export class GetDiaryListResponseDto {
  @ApiProperty({ type: [DiaryIncludeImagesAndLikeCount] })
  readonly diaries: DiaryIncludeImagesAndLikeCount[];

  constructor(partial: Partial<GetDiaryListResponseDto>) {
    Object.assign(this, partial);
  }
}
