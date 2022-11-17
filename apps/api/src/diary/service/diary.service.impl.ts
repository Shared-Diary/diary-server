import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@app/prisma';
import { UploadFileService } from '@app/upload-file';

import { getDiaryStartAndEndAt } from '@app/utils';
import { DAILY_MAX_CREATE_COUNT } from '@api/shared/constant';
import { DiaryService } from './diary.service';
import { CreateDiaryRequestDto } from '../dto';
import { DiaryImageRepository, DiaryRepository } from '../repository';
import { CreateDiaryImagesType } from '../type';
import { MaxDiaryCreateCountException } from '../exception';

@Injectable()
export class DiaryServiceImpl implements DiaryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly diaryRepository: DiaryRepository,
    private readonly diaryImageRepository: DiaryImageRepository,
    private readonly uploadFileService: UploadFileService,
  ) {}

  async createDiary(
    { title, content, isOpen }: CreateDiaryRequestDto,
    userId: number,
    diaryImageFiles?: Express.Multer.File[],
  ): Promise<void> {
    await this.validateExceedMaxCountOfDailyCreate(userId);

    await this.prismaService.$transaction(async (prisma) => {
      const { id: diaryId } = await this.diaryRepository.create(prisma, {
        userId,
        title,
        content,
        isOpen,
      });

      if (diaryImageFiles) {
        await this.createDiaryImages({ diaryId, diaryImageFiles, prisma });
      }
    });
  }

  private async validateExceedMaxCountOfDailyCreate(userId: number) {
    const { startAt, endAt } = getDiaryStartAndEndAt();
    const dailyDiaryCount =
      await this.diaryRepository.getCountBetweenDatesByUser({
        prisma: this.prismaService,
        userId,
        startDate: startAt,
        endDate: endAt,
      });

    if (dailyDiaryCount >= DAILY_MAX_CREATE_COUNT) {
      throw new MaxDiaryCreateCountException(DAILY_MAX_CREATE_COUNT);
    }
  }

  private async createDiaryImages({
    diaryId,
    diaryImageFiles,
    prisma,
  }: CreateDiaryImagesType) {
    const imageUrls = await this.uploadFileService.getUploadedImageList(
      diaryImageFiles,
    );
    const createInput = this.parseCreateDiaryImageInput(diaryId, imageUrls);
    await this.diaryImageRepository.createImages(prisma, createInput);
  }

  private parseCreateDiaryImageInput(
    diaryId: number,
    imageUrls: string[],
  ): Prisma.DiaryImageUncheckedCreateInput[] {
    return imageUrls.map((imageUrl) => ({ diaryId, imageUrl }));
  }
}
