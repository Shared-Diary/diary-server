import {
  CreateDiaryRequestDto,
  GetDiaryListQueryRequestDto,
  GetDiaryListResponseDto,
  GetDiaryParamRequestDto,
  GetDiaryResponseDto,
} from '../dto';

export abstract class DiaryService {
  abstract createDiary(
    dto: CreateDiaryRequestDto,
    userId: number,
    diaryImageFile?: Express.Multer.File[],
  ): Promise<void>;

  abstract getDiaryList(
    queryDto: GetDiaryListQueryRequestDto,
  ): Promise<GetDiaryListResponseDto>;

  abstract getDiary(
    paramRequestDto: GetDiaryParamRequestDto,
  ): Promise<GetDiaryResponseDto>;
}
