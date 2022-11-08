import { NestFactory } from '@nestjs/core';

import { ApiModule } from './api.module';
import { corsOptions, buildSwagger } from './configs';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  app.enableVersioning();

  app.enableCors(corsOptions);
  buildSwagger(app, {
    title: 'Diary Server',
    description: 'Diary Server API 입니다',
    path: '/api',
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
