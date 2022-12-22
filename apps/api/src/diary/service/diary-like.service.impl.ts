import { Injectable } from '@nestjs/common';

import { DiaryLikeService } from './diary-like.service';
import { GenerateDiaryLikeRequestDto } from '../dto/requests';
import { DiaryLikeRepository } from '../repository';
import { DiaryService } from './diary.service';
import { DiaryLikeEntity } from '../entity';

@Injectable()
export class DiaryLikeServiceImpl implements DiaryLikeService {
  constructor(
    private readonly diaryLikeRepository: DiaryLikeRepository,
    private readonly diaryService: DiaryService,
  ) {}

  async createOrUpdateDiaryLikes(
    { diaryId }: GenerateDiaryLikeRequestDto,
    userId: number,
  ): Promise<void> {
    await this.diaryService.validateOpenDiary(diaryId);

    const diaryLike = await this.diaryLikeRepository.findUserLike(
      diaryId,
      userId,
    );

    const isDiaryLikeExist = !!diaryLike;
    if (isDiaryLikeExist) {
      await this.updateDiaryLikeStatusReversal(diaryLike);
    } else {
      await this.createDiaryLike(diaryId, userId);
    }
  }

  private async createDiaryLike(
    diaryId: number,
    userId: number,
  ): Promise<void> {
    await this.diaryLikeRepository.create({
      diaryId,
      userId,
    });
  }

  private async updateDiaryLikeStatusReversal(
    diaryLike: DiaryLikeEntity,
  ): Promise<void> {
    const { id, status } = diaryLike;

    const reversedStatus = !status;
    await this.diaryLikeRepository.update(id, { status: reversedStatus });
  }
}
