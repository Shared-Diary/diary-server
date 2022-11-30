import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

import { MIN_ID } from '@api/shared/constant';

export class GetDiaryParamRequestDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(MIN_ID)
  readonly diaryId: number;
}
