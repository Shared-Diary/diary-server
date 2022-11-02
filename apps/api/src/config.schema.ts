import * as Joi from 'joi';

export default Joi.object({
  DATABASE_URL: Joi.string().required(),
  ACCESS_TOKEN_SECRET: Joi.string().required(),
  ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
});
