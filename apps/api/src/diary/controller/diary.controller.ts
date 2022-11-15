import { Body, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { User } from '@app/utils/decorators';
import { UserRequestDto } from '@api/shared/dto';

import {
  DiaryController as Controller,
  CreateDiary,
} from './diary.controller.decorator';
import { DiaryService } from '../service';
import { CreateDiaryRequestDto } from '../dto';

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
    { diaryImageFile }: { diaryImageFile?: Express.Multer.File[] },
  ): Promise<null> {
    await this.diaryService.createDiary(
      createDiaryRequestDto,
      userId,
      diaryImageFile,
    );

    return null;
  }
}
