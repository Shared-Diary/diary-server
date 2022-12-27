import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@app/prisma';
import { UploadFileService } from '@app/upload-file';
import { PrismaErrorException } from '@app/prisma/exception';
import { getDiaryStartAndEndAt } from '@app/utils';
import { DAILY_MAX_CREATE_COUNT } from '@api/shared/constant';
import { WithTotal } from '@app/shared/type';

import { DiaryService } from './diary.service';
import {
  CreateDiaryImageRequestDto,
  CreateDiaryRequestDto,
  GetDiaryListQueryRequestDto,
  GetDiaryParamRequestDto,
} from '../dto/requests';
import { DiaryImageRepository, DiaryRepository } from '../repository';
import {
  MaxDiaryCreateCountException,
  NotDiaryImageException,
  NotFoundDiaryException,
  NotFoundDiaryImageException,
  NotUserDiaryException,
} from '../exception';
import {
  DeleteDiaryImageOptions,
  DiaryIncludeImageAndLike,
  GetMyDiaryOptions,
  UpdateDiaryOptions,
} from '../type';
import { DiaryEntity } from '../entity';

@Injectable()
export class DiaryServiceImpl implements DiaryService {
  constructor(
    private readonly diaryRepository: DiaryRepository,
    private readonly diaryImageRepository: DiaryImageRepository,
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
      await this.diaryRepository.findCountBetweenDatesByUser({
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
    return this.uploadFileService.getUploadedImageUrlList(diaryImageFiles);
  }

  getDiaryList(
    queryDto: GetDiaryListQueryRequestDto,
  ): Promise<WithTotal<DiaryIncludeImageAndLike[]>> {
    const { page, pageSize } = queryDto;

    return this.diaryRepository.findListIncludeLikeAndImage({
      page,
      pageSize,
    });
  }

  async validateOpenDiary(diaryId: number): Promise<void> {
    const diary = await this.diaryRepository.findById(diaryId);

    this.validateIsOpenedDiary(diary);
  }

  async getDiary({
    diaryId,
  }: GetDiaryParamRequestDto): Promise<DiaryIncludeImageAndLike> {
    const diaryIncludeLikeAndImage =
      await this.diaryRepository.findIncludeLikeAndImage(diaryId);

    this.validateIsOpenedDiary(diaryIncludeLikeAndImage);

    return diaryIncludeLikeAndImage;
  }

  private validateIsOpenedDiary(diary: DiaryEntity | null) {
    if (!diary || !diary.status || !diary.isOpen) {
      throw new NotFoundDiaryException();
    }
  }

  async getMyDiaryList({
    userId,
    page,
    pageSize,
  }: GetMyDiaryOptions): Promise<WithTotal<DiaryIncludeImageAndLike[]>> {
    return this.diaryRepository.findByUserIncludeLikeAndImage({
      userId,
      page,
      pageSize,
    });
  }

  async updateDiary({
    userId,
    paramDto,
    bodyDto,
  }: UpdateDiaryOptions): Promise<void> {
    const { diaryId } = paramDto;
    const { title, content, isOpen } = bodyDto;

    await this.validateUserDiary(userId, diaryId);

    await this.diaryRepository.update(diaryId, { title, content, isOpen });
  }

  async createDiaryImage(
    { diaryId }: CreateDiaryImageRequestDto,
    file: Express.Multer.File,
    userId: number,
  ): Promise<void> {
    await this.validateUserDiary(userId, diaryId);

    const imageUrl = await this.uploadFileService.getUploadedImageUrl(file);

    await this.diaryImageRepository.create({
      diaryId,
      imageUrl,
    });
  }

  async deleteDiaryImage({
    userId,
    diaryImageId,
    diaryId,
  }: DeleteDiaryImageOptions): Promise<void> {
    await this.validateUserDiary(userId, diaryId);

    await this.validateDiaryImage(diaryId, diaryImageId);

    await this.diaryImageRepository.delete({ id: diaryImageId });
  }

  private async validateUserDiary(userId: number, diaryId: number) {
    const diary = await this.diaryRepository.findById(diaryId);

    if (!diary || !diary.status) {
      throw new NotFoundDiaryException();
    }
    if (userId !== diary.userId) {
      throw new NotUserDiaryException();
    }
  }

  private async validateDiaryImage(diaryId: number, diaryImageId: number) {
    const diaryImage = await this.diaryImageRepository.findById(diaryImageId);
    if (!diaryImage) {
      throw new NotFoundDiaryImageException();
    }
    if (diaryId !== diaryImage.diaryId) {
      throw new NotDiaryImageException();
    }
  }
}
