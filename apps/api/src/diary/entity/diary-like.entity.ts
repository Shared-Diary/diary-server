import { DiaryLike } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class DiaryLikeEntity implements DiaryLike {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  diaryId: number;
}
