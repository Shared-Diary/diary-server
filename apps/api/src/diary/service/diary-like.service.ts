import { WithTotal } from '@app/shared/type';

import { GenerateDiaryLikeRequestDto } from '../dto/requests';
import { DiaryLikeWithUserProfile, GetDiaryLikeUserListOptions } from '../type';

export abstract class DiaryLikeService {
  abstract createOrUpdateDiaryLikes(
    dto: GenerateDiaryLikeRequestDto,
    userId: number,
  ): Promise<void>;

  abstract getDiaryLikeUserList(
    options: GetDiaryLikeUserListOptions,
  ): Promise<WithTotal<DiaryLikeWithUserProfile[]>>;
}
