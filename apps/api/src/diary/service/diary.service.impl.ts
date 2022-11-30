import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as _ from 'radash';

import { PrismaService } from '@app/prisma';
import { UploadFileService } from '@app/upload-file';
import { PrismaErrorException } from '@app/prisma/exception';
import { getDiaryStartAndEndAt } from '@app/utils';
import { DAILY_MAX_CREATE_COUNT } from '@api/shared/constant';

import { DiaryService } from './diary.service';
import {
  CreateDiaryRequestDto,
  DiaryIncludeImagesAndLikeCount,
  GetDiaryListQueryRequestDto,
  GetDiaryListResponseDto,
  GetDiaryParamRequestDto,
  GetDiaryResponseDto,
} from '../dto';
import { DiaryRepository } from '../repository';
import {
  MaxDiaryCreateCountException,
  NotFoundDiaryException,
} from '../exception';
import { DiaryIncludeImageAndLikeType } from '../type';

@Injectable()
export class DiaryServiceImpl implements DiaryService {
  constructor(
    private readonly diaryRepository: DiaryRepository,
    private readonly uploadFileService: UploadFileService,
  ) {}

  async createDiary(
    dto: CreateDiaryRequestDto,
    userId: number,
    diaryImageFiles?: Express.Multer.File[],
  ): Promise<void> {
    const { title, content, isOpen } = dto;

    await this.validateExceedMaxCountOfDailyCreate(userId);

    try {
      await this.diaryRepository.create({
        userId,
        title,
        content,
        isOpen,
        ...(diaryImageFiles && {
          diaryImage: {
            create:
              diaryImageFiles &&
              (await this.parseCreateDiaryImageInput(diaryImageFiles)),
          },
        }),
      });
    } catch (error) {
      if (PrismaService.isPrismaError(error)) {
        throw new PrismaErrorException(error?.code);
      }
      throw new InternalServerErrorException();
    }
  }

  private async validateExceedMaxCountOfDailyCreate(userId: number) {
    const { startAt, endAt } = getDiaryStartAndEndAt();
    const dailyDiaryCount =
      await this.diaryRepository.getCountBetweenDatesByUser({
        userId,
        startDate: startAt,
        endDate: endAt,
      });

    if (dailyDiaryCount >= DAILY_MAX_CREATE_COUNT) {
      throw new MaxDiaryCreateCountException(DAILY_MAX_CREATE_COUNT);
    }
  }

  private async parseCreateDiaryImageInput(
    diaryImageFiles: Express.Multer.File[],
  ): Promise<Prisma.DiaryImageCreateManyDiaryInput[]> {
    const imageUrls = await this.getImageUrls(diaryImageFiles);

    return imageUrls.map((imageUrl) => ({ imageUrl }));
  }

  private getImageUrls(diaryImageFiles: Express.Multer.File[]) {
    return this.uploadFileService.getUploadedImageList(diaryImageFiles);
  }

  async getDiaryList(
    queryDto: GetDiaryListQueryRequestDto,
  ): Promise<GetDiaryListResponseDto> {
    const { page, pageSize } = queryDto;

    const [diariesIncludeLikeAndImage, total] =
      await this.diaryRepository.getListIncludeLikeAndImage({
        page,
        pageSize,
      });

    return {
      diaries: _.isEmpty(diariesIncludeLikeAndImage)
        ? null
        : this.parseGetListImageResponse(diariesIncludeLikeAndImage),
      total,
    };
  }

  private parseGetListImageResponse(
    diaries: DiaryIncludeImageAndLikeType[],
  ): DiaryIncludeImagesAndLikeCount[] {
    return diaries.map((diary: DiaryIncludeImageAndLikeType) => {
      const { diaryImage, diaryLike, ...rest } = diary;

      return {
        ...rest,
        image: diaryImage,
        likeCount: diaryLike.length,
      };
    });
  }

  async getDiary({
    diaryId,
  }: GetDiaryParamRequestDto): Promise<GetDiaryResponseDto> {
    const diaryIncludeLikeAndImage =
      await this.diaryRepository.getIncludeLikeAndImage(diaryId);

    this.validateIsOpenedDiary(diaryIncludeLikeAndImage);

    const { diaryImage, diaryLike, ...diary } = diaryIncludeLikeAndImage;

    return {
      diary,
      images: diaryImage,
      likeCount: diaryLike.length,
    };
  }

  private validateIsOpenedDiary(diary: DiaryIncludeImageAndLikeType) {
    if (!diary || !diary.status || !diary.isOpen) {
      throw new NotFoundDiaryException();
    }
  }
}
