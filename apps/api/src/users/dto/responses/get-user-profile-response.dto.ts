import { UserWithProfile } from '../../type';

export class GetUserProfileResponseDto {
  readonly signUpDate: string;

  readonly profileImageUrl: string | null;

  readonly nickName: string | null;

  readonly introduce: string | null;

  constructor(userWithProfile: UserWithProfile) {
    const { createdAt, userProfile } = userWithProfile;

    this.signUpDate = createdAt.toISOString();
    this.profileImageUrl = userProfile ? userProfile.profileUrl : null;
    this.nickName = userProfile ? userProfile.nickName : null;
    this.introduce = userProfile ? userProfile.introduce : null;
  }
}
