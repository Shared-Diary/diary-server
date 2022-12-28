import { GenerateDiaryLikeRequestDto } from '../dto/requests';
import { DiaryLikeWithUserProfile } from '../type';

export abstract class DiaryLikeService {
  abstract createOrUpdateDiaryLikes(
    dto: GenerateDiaryLikeRequestDto,
    userId: number,
  ): Promise<void>;

  abstract getDiaryLikeUserList(
    diaryId: number,
  ): Promise<DiaryLikeWithUserProfile[]>;
}
