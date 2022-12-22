import { Body } from '@nestjs/common';

import { Jwt } from '@app/utils/decorators';
import { JwtRequestDto } from '@api/shared/dto';

import { DiaryLikeService } from '../service';
import {
  DiaryLikeController as Controller,
  GenerateDiaryLike,
} from './decorator/diary-like.controller.decorator';
import { GenerateDiaryLikeRequestDto } from '../dto/requests';

@Controller()
export class DiaryLikeController {
  constructor(private readonly diaryLikeService: DiaryLikeService) {}

  @GenerateDiaryLike()
  async generateDiaryLike(
    @Jwt() { userId }: JwtRequestDto,
    @Body() dto: GenerateDiaryLikeRequestDto,
  ): Promise<null> {
    await this.diaryLikeService.createOrUpdateDiaryLikes(dto, userId);

    return null;
  }
}
