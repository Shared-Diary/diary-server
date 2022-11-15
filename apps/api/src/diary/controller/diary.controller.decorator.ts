import { applyDecorators, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuth } from '@app/utils/guards';

export const DiaryController = () =>
  applyDecorators(
    Controller({ path: '/diary', version: ['1'] }),
    ApiTags('Diary'),
  );

export const CreateDiary = () =>
  applyDecorators(
    Post('/'),
    JwtAuth(),
    ApiOperation({
      summary: '일기장 생성 API',
    }),
    ApiCreatedResponse({
      schema: {},
    }),
  );
