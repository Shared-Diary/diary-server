import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

import { MIN_ID } from '@api/shared/constant';
import { PaginationRequestDto } from '@api/shared/dto';

export class GetDiaryLikeUserListParamRequestDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(MIN_ID)
  readonly diaryId: number;
}

export class GetDiaryLikeUserListQueryRequestDto extends PaginationRequestDto {}
