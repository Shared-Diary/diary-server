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
  ): Promise<void> {
    await this.diaryRepository.create(this.prismaService, {
      userId,
      title,
      content,
    });
  }
}
