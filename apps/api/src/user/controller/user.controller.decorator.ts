import { applyDecorators, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuth, Throttler } from '@app/utils/guards';

import { GetUserProfileResponseDto } from '../dto/responses';
import { CreateUserProfileDtoForSwagger } from '../dto/requests';

export const UserController = () =>
  applyDecorators(Controller('/user'), ApiTags('Users'));

export const GetUserProfile = () =>
  applyDecorators(
    Get('/:userId/profile'),
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
    Post('/profile'),
    JwtAuth(),
    ApiOperation({
      summary: '유저 프로필 생성 API',
    }),
    ApiBody({
      type: CreateUserProfileDtoForSwagger,
    }),
  );
