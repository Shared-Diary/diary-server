import { Diary } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class DiaryEntity implements Diary {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  status: boolean;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  isOpen: boolean;
}
