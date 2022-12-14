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
  GetMyDiaryList,
  UpdateDiary,
  CreateDiaryImage,
  DeleteDiaryImage,
} from './decorator/diary.controller.decorator';
import { DiaryService } from '../service';
import {
  CreateDiaryRequestDto,
  GetDiaryListQueryRequestDto,
  GetDiaryParamRequestDto,
  UpdateDiaryParamRequestDto,
  UpdateDiaryRequestDto,
  GetMyDiaryListRequestDto,
  CreateDiaryImageRequestDto,
  DeleteDiaryImageParamRequestDto,
} from '../dto/requests';
import {
  GetDiaryListResponseDto,
  GetDiaryResponseDto,
  GetMyDiaryListResponseDto,
} from '../dto/responses';

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
    const [diaries, total] = await this.diaryService.getDiaryList(
      queryRequestDto,
    );

    return new GetDiaryListResponseDto(diaries, total);
  }

  @GetDiary()
  async getDiary(@Param() paramRequestDto: GetDiaryParamRequestDto) {
    const diary = await this.diaryService.getDiary(paramRequestDto);

    return new GetDiaryResponseDto(diary);
  }

  @GetMyDiaryList()
  async getMyDiaryList(
    @Jwt() { userId }: JwtRequestDto,
    @Query() { page, pageSize }: GetMyDiaryListRequestDto,
  ) {
    const [diaries, total] = await this.diaryService.getMyDiaryList({
      userId,
      page,
      pageSize,
    });

    return new GetMyDiaryListResponseDto(diaries, total);
  }

  @UpdateDiary()
  async updateDiary(
    @Jwt() { userId }: JwtRequestDto,
    @Param() { diaryId }: UpdateDiaryParamRequestDto,
    @Body() bodyDto: UpdateDiaryRequestDto,
  ): Promise<null> {
    await this.diaryService.updateDiary({ userId, diaryId, bodyDto });

    return null;
  }

  @CreateDiaryImage()
  @FileRequest('diaryImageFile')
  async createDiaryImage(
    @Jwt() { userId }: JwtRequestDto,
    @Body() dto: CreateDiaryImageRequestDto,
    @UploadedFile() diaryImageFile?: Express.Multer.File,
  ): Promise<null> {
    if (!diaryImageFile) {
      throw new FileRequiredException('diaryImageFile');
    }
    await this.diaryService.createDiaryImage(dto, diaryImageFile, userId);

    return null;
  }

  @DeleteDiaryImage()
  async deleteDiaryImage(
    @Jwt() { userId }: JwtRequestDto,
    @Param() { diaryId, diaryImageId }: DeleteDiaryImageParamRequestDto,
  ): Promise<null> {
    await this.diaryService.deleteDiaryImage({ userId, diaryId, diaryImageId });

    return null;
  }
}
