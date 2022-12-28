import { WithTotal } from '@app/shared/type';

import {
  CreateDiaryImageRequestDto,
  CreateDiaryRequestDto,
  GetDiaryListQueryRequestDto,
  GetDiaryParamRequestDto,
} from '../dto/requests';
import {
  DeleteDiaryImageOptions,
  DiaryIncludeImageAndLike,
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
  ): Promise<WithTotal<DiaryIncludeImageAndLike[]>>;

  abstract getDiary(
    paramRequestDto: GetDiaryParamRequestDto,
  ): Promise<DiaryIncludeImageAndLike>;

  abstract getMyDiaryList(
    options: GetMyDiaryOptions,
  ): Promise<WithTotal<DiaryIncludeImageAndLike[]>>;

  abstract updateDiary(options: UpdateDiaryOptions): Promise<void>;

  abstract createDiaryImage(
    dto: CreateDiaryImageRequestDto,
    file: Express.Multer.File,
    userId: number,
  ): Promise<void>;

  abstract validateOpenDiary(diaryId: number): Promise<void>;

  abstract deleteDiaryImage(options: DeleteDiaryImageOptions): Promise<void>;

  abstract validateExistDiary(diaryId: number): Promise<void>;
}
