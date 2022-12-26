import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

import { MIN_ID } from '@api/shared/constant';

export class DeleteDiaryImageParamRequestDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(MIN_ID)
  readonly diaryId: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(MIN_ID)
  readonly diaryImageId: number;
}
