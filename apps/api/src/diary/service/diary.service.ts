import {
  CreateDiaryRequestDto,
  DiaryIncludeImagesAndLikeCount,
  GetDiaryListQueryRequestDto,
} from '../dto';

export abstract class DiaryService {
  abstract createDiary(
    dto: CreateDiaryRequestDto,
    userId: number,
    diaryImageFile?: Express.Multer.File[],
  ): Promise<void>;

  abstract getDiaryList(
    queryDto: GetDiaryListQueryRequestDto,
  ): Promise<DiaryIncludeImagesAndLikeCount[] | null>;
}
