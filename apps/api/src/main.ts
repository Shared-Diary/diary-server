import { NestFactory } from '@nestjs/core';

import { ApiModule } from './api.module';
import { corsOptions, buildSwagger } from './configs';

const isDevelopment = ['local', 'dev', 'prod'].includes(process.env.NODE_ENV);

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  app.enableVersioning();

  app.enableCors(corsOptions);

  // TODO: Production 배포 시 if 문 활성화 하기
  // if (isDevelopment) {
  buildSwagger(app, {
    title: 'Diary Server',
    description: 'Diary Server API 입니다',
    path: '/api',
  });
  // }

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
