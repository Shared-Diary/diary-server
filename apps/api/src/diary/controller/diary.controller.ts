import {
  Body,
  Param,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { User } from '@app/utils/decorators';
import { UserRequestDto } from '@api/shared/dto';

import {
  DiaryController as Controller,
  CreateDiary,
  GetDiaryList,
  GetDiary,
  GetMyDiary,
} from './decorator/diary.controller.decorator';
import { DiaryService } from '../service';
import {
  CreateDiaryRequestDto,
  GetDiaryListQueryRequestDto,
  GetDiaryParamRequestDto,
} from '../dto/requests';
import { GetDiaryListResponseDto, GetDiaryResponseDto } from '../dto/responses';
import { GetMyDiaryListRequestDto } from '../dto/requests/get-my-diary-list-request.dto';

@Controller()
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @CreateDiary()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'diaryImageFile', maxCount: 5 }]),
  )
  async createDiary(
    @User() { userId }: UserRequestDto,
    @Body() createDiaryRequestDto: CreateDiaryRequestDto,
    @UploadedFiles()
    files: { diaryImageFile?: Express.Multer.File[] },
  ): Promise<null> {
    await this.diaryService.createDiary(
      createDiaryRequestDto,
      userId,
      files?.diaryImageFile,
    );

    return null;
  }

  @GetDiaryList()
  async getDiaryList(@Query() queryRequestDto: GetDiaryListQueryRequestDto) {
    const { diaries, total } = await this.diaryService.getDiaryList(
      queryRequestDto,
    );

    return new GetDiaryListResponseDto({
      diaries,
      total,
    });
  }

  @GetDiary()
  async getDiary(@Param() paramRequestDto: GetDiaryParamRequestDto) {
    const { diary, likeCount, images } = await this.diaryService.getDiary(
      paramRequestDto,
    );

    return new GetDiaryResponseDto({
      diary,
      likeCount,
      images,
    });
  }

  @GetMyDiary()
  async getMyDiary(
    @User() { userId }: UserRequestDto,
    @Query() { page, pageSize }: GetMyDiaryListRequestDto,
  ) {
    const diaries = await this.diaryService.getMyDiaryList({
      userId,
      page,
      pageSize,
    });

    return diaries;
  }
}
