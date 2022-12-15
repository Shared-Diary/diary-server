import { Body, Param, Query, UploadedFiles } from '@nestjs/common';

import { FilesRequest, Jwt } from '@app/utils/decorators';
import { JwtRequestDto } from '@api/shared/dto';

import {
  DiaryController as Controller,
  CreateDiary,
  GetDiaryList,
  GetDiary,
  GetMyDiary,
  UpdateDiary,
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
  @FilesRequest([{ name: 'diaryImageFile', maxCount: 5 }])
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
    return null;
  }
}
