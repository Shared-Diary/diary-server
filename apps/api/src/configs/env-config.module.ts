import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

const validationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  ACCESS_TOKEN_SECRET: Joi.string().required(),
  ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
});

export default ConfigModule.forRoot({
  envFilePath: [`environments/.${process.env.NODE_ENV}.env`],
  isGlobal: true,
  validationSchema,
});
