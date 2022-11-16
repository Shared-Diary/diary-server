import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

const validationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  ACCESS_TOKEN_SECRET: Joi.string().required(),
  ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
  AWS_S3_BUCKET_NAME: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_REGION: Joi.string().required(),
  AWS_S3_URL: Joi.string().required(),
});

export default ConfigModule.forRoot({
  envFilePath: [`environments/.${process.env.NODE_ENV}.env`],
  isGlobal: true,
  validationSchema,
});
