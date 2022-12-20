import { Injectable } from '@nestjs/common';

import { DiaryLikeService } from './diary-like.service';
import { GenerateDiaryLikeRequestDto } from '../dto/requests';
import { DiaryLikeRepository } from '../repository';
import { DiaryService } from './diary.service';

@Injectable()
export class DiaryLikeServiceImpl implements DiaryLikeService {
  constructor(
    private readonly diaryLikeRepository: DiaryLikeRepository,
    private readonly diaryService: DiaryService,
  ) {}

  async generateDiaryLikes(
    dto: GenerateDiaryLikeRequestDto,
    userId: number,
  ): Promise<void> {
    return Promise.resolve(undefined);
  }
}
