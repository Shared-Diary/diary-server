import { applyDecorators, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export const DiaryController = () =>
  applyDecorators(
    Controller({ path: '/diary', version: ['1'] }),
    ApiTags('Diary'),
  );
