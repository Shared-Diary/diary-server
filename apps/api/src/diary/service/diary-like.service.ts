import { GenerateDiaryLikeRequestDto } from '../dto/requests';

export abstract class DiaryLikeService {
  abstract generateDiaryLikes(
    dto: GenerateDiaryLikeRequestDto,
    userId: number,
  ): Promise<void>;
}
