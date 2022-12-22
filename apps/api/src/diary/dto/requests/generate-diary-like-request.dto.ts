import { IsInt, IsNotEmpty, Min } from 'class-validator';

import { MIN_ID } from '@api/shared/constant';

export class GenerateDiaryLikeRequestDto {
  @IsNotEmpty()
  @IsInt()
  @Min(MIN_ID)
  readonly diaryId: number;
}
