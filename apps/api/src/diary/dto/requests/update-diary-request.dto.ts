import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

import {
  MAX_CONTENT_LENGTH,
  MAX_TITLE_LENGTH,
  MIN_ID,
} from '@api/shared/constant';
import { ToBoolean } from '@app/utils/decorators';

export class UpdateDiaryRequestDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(MAX_TITLE_LENGTH)
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(MAX_CONTENT_LENGTH)
  readonly content: string;

  @IsNotEmpty()
  @ToBoolean()
  @IsBoolean()
  readonly isOpen: boolean;
}

export class UpdateDiaryParamRequestDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(MIN_ID)
  readonly diaryId: number;
}
