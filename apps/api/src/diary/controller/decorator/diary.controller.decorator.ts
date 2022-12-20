import { applyDecorators, Controller, Get, Post, Put } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuth, Throttler } from '@app/utils/guards';
import {
  CreateDiaryImageRequestDtoForSwagger,
  CreateDiaryRequestDtoForSwagger,
} from '../../dto/requests';

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
    ApiBody({
      type: CreateDiaryRequestDtoForSwagger,
    }),
    ApiCreatedResponse({
      schema: {},
    }),
    ApiForbiddenResponse({
      description: '하루 일기장 생성 개수를 초과한 경우',
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
    ApiNotFoundResponse({
      description: '존재하지 않는 일기장이거나 공개된 일기장이 아닌 경우',
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
    ApiOkResponse({
      schema: {},
    }),
    ApiNotFoundResponse({
      description: '존재하지 않는 일기장인 경우',
    }),
    ApiForbiddenResponse({
      description: '유저 본인의 일기장이 아닌 경우',
    }),
  );

export const CreateDiaryImage = () =>
  applyDecorators(
    Post('/image'),
    JwtAuth(),
    ApiOperation({
      summary: '일기장 이미지 추가 API',
    }),
    ApiBody({
      type: CreateDiaryImageRequestDtoForSwagger,
    }),
  );

export const GenerateDiaryLike = () =>
  applyDecorators(
    Post('/like'),
    JwtAuth(),
    ApiOperation({
      summary: '일기장 좋아요 API',
    }),
  );
