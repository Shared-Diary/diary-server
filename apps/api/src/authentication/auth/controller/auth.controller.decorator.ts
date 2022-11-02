import { applyDecorators, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

export const AuthController = () =>
  applyDecorators(
    Controller({ path: '/auth', version: ['1'] }),
    ApiTags('Auth'),
  );

export const Register = () =>
  applyDecorators(
    Post('/register'),
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
    ApiOperation({
      summary: '로그인 API',
    }),
  );
