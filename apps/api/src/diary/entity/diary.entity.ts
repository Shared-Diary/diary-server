import { Diary } from '@prisma/client';

export class DiaryEntity implements Diary {
  id: number;

  createdAt: Date;

  updatedAt: Date;

  status: boolean;

  userId: number;

  title: string;

  content: string;

  isOpen: boolean;
}
