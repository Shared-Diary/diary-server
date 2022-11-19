import { DiaryImage } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class DiaryImageEntity implements DiaryImage {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  diaryId: number;

  @ApiProperty()
  imageUrl: string;
}
