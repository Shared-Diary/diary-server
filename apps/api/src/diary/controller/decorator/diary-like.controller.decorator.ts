import { applyDecorators, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuth, Throttler } from '@app/utils/guards';

export const DiaryLikeController = () =>
  applyDecorators(
    Controller({ path: '/diary', version: ['1'] }),
    ApiTags('Diary Like'),
  );

export const GenerateDiaryLike = () =>
  applyDecorators(
    Post('/like'),
    JwtAuth(),
    ApiOperation({
      summary: '일기장 좋아요 API',
    }),
  );

export const GetDiaryLikeUserList = () =>
  applyDecorators(
    Get('/:diaryId/like/user'),
    Throttler(),
    ApiOperation({
      summary: '일기장 좋아요 유저 리스트 조회',
    }),
  );
