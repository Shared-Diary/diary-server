import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ApiModule } from './api.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  app.enableVersioning();

  const config = new DocumentBuilder()
    .setTitle('Diary Server Api Docs')
    .setDescription('다이어리 서버 API 문서입니다')
    .addBearerAuth()
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'conventional',
    },
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
