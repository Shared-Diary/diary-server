import { applyDecorators, Controller, Get, Post, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuth, Throttler } from '@app/utils/guards';

export const DiaryController = () =>
  applyDecorators(
    Controller({ path: '/diary', version: ['1'] }),
    ApiTags('Diary'),
  );

export const CreateDiary = () =>
  applyDecorators(
    Post('/'),
    JwtAuth(),
    ApiOperation({
      summary: '일기장 생성 API',
    }),
    ApiCreatedResponse({
      schema: {},
    }),
  );

export const GetDiaryList = () =>
  applyDecorators(
    Get('/'),
    Throttler(),
    ApiOperation({
      summary: '일기장 리스트 조회 With 좋아요 개수',
    }),
  );

export const GetDiary = () =>
  applyDecorators(
    Get('/:diaryId/detail'),
    Throttler(),
    ApiOperation({
      summary: '일기장 상세 조회 API',
    }),
  );

export const GetMyDiary = () =>
  applyDecorators(
    Get('/me'),
    JwtAuth(),
    ApiOperation({
      summary: '내 일기장 리스트 조회 API',
    }),
  );

export const UpdateDiary = () =>
  applyDecorators(
    Put('/:diaryId'),
    JwtAuth(),
    ApiOperation({
      summary: '일기장 수정 API',
    }),
  );
