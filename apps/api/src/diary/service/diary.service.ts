import { WithTotal } from '@app/shared/type';

import {
  CreateDiaryImageRequestDto,
  CreateDiaryRequestDto,
  GetDiaryListQueryRequestDto,
  GetDiaryParamRequestDto,
} from '../dto/requests';
import { GetDiaryResponseDto, GetDiaryListResponseDto } from '../dto/responses';
import {
  DiaryIncludeImageAndLikeType,
  GetMyDiaryOptions,
  UpdateDiaryOptions,
} from '../type';

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
  ): Promise<WithTotal<DiaryIncludeImageAndLikeType[]>>;

  abstract updateDiary(options: UpdateDiaryOptions): Promise<void>;

  abstract createDiaryImage(
    dto: CreateDiaryImageRequestDto,
    file: Express.Multer.File,
    userId: number,
  ): Promise<void>;

  abstract validateOpenDiary(diaryId: number): Promise<void>;
}
