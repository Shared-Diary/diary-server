import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

interface ApiOptions {
  title: string;
  description: string;
  path: string;
}

export const buildSwagger = (
  app: INestApplication,
  { title, description, path }: ApiOptions,
): void => {
  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .addBearerAuth()
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(path, app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'conventional',
    },
  });
};
