import { DiaryEntity, DiaryImageEntity, DiaryLikeEntity } from '../entity';
import {
  UpdateDiaryParamRequestDto,
  UpdateDiaryRequestDto,
} from '../dto/requests';

export type DiaryIncludeImageAndLikeType = DiaryEntity & {
  diaryImage: DiaryImageEntity[];
  diaryLike: DiaryLikeEntity[];
};

export type GetMyDiaryOptions = {
  userId: number;
  page: number;
  pageSize: number;
};

export type UpdateDiaryOptions = {
  userId: number;
  paramDto: UpdateDiaryParamRequestDto;
  bodyDto: UpdateDiaryRequestDto;
};

export type CreateDiaryLikeIfNotExistParam = {
  diaryId: number;
  userId: number;
  isDiaryLikeExist: boolean;
};
