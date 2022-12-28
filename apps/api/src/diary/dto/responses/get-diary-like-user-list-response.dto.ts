import { GetDiaryLikeUserResponseDto } from './get-diary-like-user-response.dto';
import { DiaryLikeWithUserProfile } from '../../type';

export class GetDiaryLikeUserListResponseDto {
  readonly diaryLikeUsers: GetDiaryLikeUserResponseDto[];

  readonly total: number;

  constructor(
    diaryLikeWithUserProfiles: DiaryLikeWithUserProfile[],
    total: number,
  ) {
    this.diaryLikeUsers = diaryLikeWithUserProfiles.map(
      (diaryLikeWithUserProfile) =>
        new GetDiaryLikeUserResponseDto(diaryLikeWithUserProfile),
    );
    this.total = total;
  }
}
