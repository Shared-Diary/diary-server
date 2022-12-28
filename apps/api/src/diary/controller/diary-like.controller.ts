import { Body, Param, Query } from '@nestjs/common';

import { Jwt } from '@app/utils/decorators';
import { JwtRequestDto } from '@api/shared/dto';

import { DiaryLikeService } from '../service';
import {
  DiaryLikeController as Controller,
  GenerateDiaryLike,
  GetDiaryLikeUserList,
} from './decorator/diary-like.controller.decorator';
import {
  GenerateDiaryLikeRequestDto,
  GetDiaryLikeUserListParamRequestDto,
  GetDiaryLikeUserListQueryRequestDto,
} from '../dto/requests';
import { GetDiaryLikeUserListResponseDto } from '../dto/responses';

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

  @GetDiaryLikeUserList()
  async getDiaryLikeUserList(
    @Param() { diaryId }: GetDiaryLikeUserListParamRequestDto,
    @Query() { page, pageSize }: GetDiaryLikeUserListQueryRequestDto,
  ) {
    const [diaryLikeUsers, total] =
      await this.diaryLikeService.getDiaryLikeUserList({
        diaryId,
        page,
        pageSize,
      });

    return new GetDiaryLikeUserListResponseDto(diaryLikeUsers, total);
  }
}
