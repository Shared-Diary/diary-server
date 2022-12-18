import { applyDecorators, Controller } from '@nestjs/common';

export const DiaryLikeController = () =>
  applyDecorators(Controller({ path: '/diary', version: ['1'] }));
