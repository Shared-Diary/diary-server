import { applyDecorators, Controller, Get, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuth, Throttler } from '@app/utils/guards';

import { GetUserProfileResponseDto } from '../dto';

export const UsersController = () =>
  applyDecorators(Controller('/users'), ApiTags('Users'));

export const GetUserProfile = () =>
  applyDecorators(
    Get('/profile'),
    Throttler(),
    ApiOperation({
      summary: '유저 프로필 조회 API',
    }),
    ApiOkResponse({
      type: GetUserProfileResponseDto,
    }),
  );

export const CreateUserProfile = () =>
  applyDecorators(
    Post(),
    JwtAuth(),
    ApiOperation({
      summary: '유저 프로필 등록 API',
    }),
    ApiCreatedResponse({
      schema: {},
    }),
  );
