import { DiaryLikeWithUserProfile } from '../../type';

export class GetDiaryLikeUserResponseDto {
  readonly id: number;

  readonly userId: number;

  readonly profileImageUrl: string | null;

  readonly nickName: string | null;

  constructor(diaryLikeWithUserProfile: DiaryLikeWithUserProfile) {
    const {
      id,
      userId,
      user: { userProfile },
    } = diaryLikeWithUserProfile;

    this.id = id;
    this.userId = userId;
    this.profileImageUrl = userProfile ? userProfile.profileUrl : null;
    this.nickName = userProfile ? userProfile.nickName : null;
  }
}
