import { DiaryLikeWithUserProfile } from '../../type';

export class GetDiaryLikeUserResponseDto {
  readonly diaryLikeId: number;

  readonly userId: number;

  readonly profileImageUrl: string | null;

  readonly nickName: string | null;

  constructor(diaryLikeWithUserProfile: DiaryLikeWithUserProfile) {
    const {
      id,
      userId,
      user: { userProfile },
    } = diaryLikeWithUserProfile;

    this.diaryLikeId = id;
    this.userId = userId;
    this.profileImageUrl = userProfile ? userProfile.profileUrl : null;
    this.nickName = userProfile ? userProfile.nickName : null;
  }
}
