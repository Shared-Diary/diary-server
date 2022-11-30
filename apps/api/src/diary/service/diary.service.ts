import {
  CreateDiaryRequestDto,
  GetDiaryListQueryRequestDto,
  GetDiaryParamRequestDto,
} from '../dto/requests';
import {
  GetDiaryResponseDto,
  GetDiaryListResponseDto,
  GetMyDiaryListResponseDto,
} from '../dto/responses';
import { GetMyDiaryOptions } from '../type';

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

  abstract getMyDiaryList(
    options: GetMyDiaryOptions,
  ): Promise<GetMyDiaryListResponseDto>;
}
