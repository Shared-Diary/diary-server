import { Injectable } from '@nestjs/common';

import { PrismaService } from '@app/prisma';

import { DiaryService } from './diary.service';
import { CreateDiaryRequestDto } from '../dto';
import { DiaryRepository } from '../repository';

@Injectable()
export class DiaryServiceImpl implements DiaryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly diaryRepository: DiaryRepository,
  ) {}

  async createDiary(
    { title, content }: CreateDiaryRequestDto,
    userId: number,
    diaryImageFile: Express.Multer.File[],
  ): Promise<void> {
    await this.prismaService.$transaction(async (prisma) => {
      const { id: diaryId } = await this.diaryRepository.create(prisma, {
        userId,
        title,
        content,
      });
    });
  }
}
