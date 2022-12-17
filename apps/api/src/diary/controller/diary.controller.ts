import {
  Body,
  Param,
  Query,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';

import { FileListRequest, FileRequest, Jwt } from '@app/utils/decorators';
import { JwtRequestDto } from '@api/shared/dto';
import { FileRequiredException } from '@app/shared/exception';

import {
  DiaryController as Controller,
  CreateDiary,
  GetDiaryList,
  GetDiary,
  GetMyDiary,
  UpdateDiary,
  CreateDiaryImage,
} from './decorator/diary.controller.decorator';
import { DiaryService } from '../service';
import {
  CreateDiaryRequestDto,
  GetDiaryListQueryRequestDto,
  GetDiaryParamRequestDto,
  UpdateDiaryParamRequestDto,
  UpdateDiaryRequestDto,
  GetMyDiaryListRequestDto,
} from '../dto/requests';
import { GetDiaryListResponseDto, GetDiaryResponseDto } from '../dto/responses';

@Controller()
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @CreateDiary()
  @FileListRequest([{ name: 'diaryImageFile', maxCount: 5 }])
  async createDiary(
    @Jwt() { userId }: JwtRequestDto,
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
    @Jwt() { userId }: JwtRequestDto,
    @Query() { page, pageSize }: GetMyDiaryListRequestDto,
  ) {
    const diaries = await this.diaryService.getMyDiaryList({
      userId,
      page,
      pageSize,
    });

    return diaries;
  }

  @UpdateDiary()
  async updateDiary(
    @Jwt() { userId }: JwtRequestDto,
    @Param() paramDto: UpdateDiaryParamRequestDto,
    @Body() bodyDto: UpdateDiaryRequestDto,
  ): Promise<null> {
    await this.diaryService.updateDiary({ userId, paramDto, bodyDto });

    return null;
  }

  @CreateDiaryImage()
  @FileRequest('diaryImageFile')
  async createDiaryImage(
    @UploadedFile() diaryImageFile?: Express.Multer.File,
  ): Promise<null> {
    if (!diaryImageFile) {
      throw new FileRequiredException('diaryImageFile');
    }

    return null;
  }
}
