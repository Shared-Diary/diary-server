import { applyDecorators, Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Throttler } from '@app/utils/guards';

import { GetUserProfileResponseDto } from '../dto';

export const UsersController = () =>
  applyDecorators(Controller('/users'), ApiTags('Users'));

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
