import { applyDecorators, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuth } from '@app/utils/guards';

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
