import { Body, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { User } from '@app/utils/decorators';
import { UserRequestDto } from '@api/shared/dto';

import {
  DiaryController as Controller,
  CreateDiary,
  GetDiaryList,
} from './decorator/diary.controller.decorator';
import { DiaryService } from '../service';
import {
  CreateDiaryRequestDto,
  GetDiaryListQueryRequestDto,
  GetDiaryListResponseDto,
} from '../dto';

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
}
