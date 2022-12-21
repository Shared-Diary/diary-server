import { GenerateDiaryLikeRequestDto } from '../dto/requests';

export abstract class DiaryLikeService {
  abstract createOrUpdateDiaryLikes(
    dto: GenerateDiaryLikeRequestDto,
    userId: number,
  ): Promise<void>;
}
