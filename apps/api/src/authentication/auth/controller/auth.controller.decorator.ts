import { applyDecorators, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Throttler } from '@app/utils/guards';

export const AuthController = () =>
  applyDecorators(
    Controller({ path: '/auth', version: ['1'] }),
    ApiTags('Auth'),
  );

export const Register = () =>
  applyDecorators(
    Post('/register'),
    Throttler(),
    ApiOperation({
      summary: '회원가입 API',
    }),
    ApiCreatedResponse({
      schema: {},
    }),
  );

export const LoginUser = () =>
  applyDecorators(
    Post('/login'),
    Throttler(),
    ApiOperation({
      summary: '로그인 API',
    }),
  );

export const SendSms = () =>
  applyDecorators(
    Post('/sms/'),
    Throttler(),
    ApiOperation({
      summary: 'Sms 전송 API',
    }),
    ApiCreatedResponse({
      schema: {},
    }),
  );

export const VerifySmsCode = () =>
  applyDecorators(
    Post('/sms/verification'),
    Throttler(),
    ApiOperation({
      summary: 'Sms Code 인증',
    }),
    ApiCreatedResponse({
      schema: {},
    }),
  );
