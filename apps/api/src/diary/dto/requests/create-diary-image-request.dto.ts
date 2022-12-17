import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { MIN_ID } from '@api/shared/constant';

export class CreateDiaryImageRequestDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(MIN_ID)
  diaryId: number;
}

export class CreateDiaryImageRequestDtoForSwagger extends CreateDiaryImageRequestDto {
  @ApiProperty({ type: 'file' })
  diaryImageFile: Express.Multer.File;
}
