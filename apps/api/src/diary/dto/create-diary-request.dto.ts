import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { MAX_CONTENT_LENGTH, MAX_TITLE_LENGTH } from '@api/shared/constant';
import { ToBoolean } from '@app/utils/decorators';

export class CreateDiaryRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(MAX_TITLE_LENGTH)
  readonly title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(MAX_CONTENT_LENGTH)
  readonly content: string;

  @ApiProperty()
  @IsNotEmpty()
  @ToBoolean()
  @IsBoolean()
  readonly isOpen: boolean;
}
