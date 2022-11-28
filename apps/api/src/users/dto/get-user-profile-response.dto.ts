export class GetUserProfileResponseDto {
  readonly signUpDate: string;

  readonly profileImageUrl: string | null;

  readonly nickName: string | null;

  readonly introduce: string | null;

  constructor({
    signUpDate,
    profileUrl,
    nickName,
    introduce,
  }: {
    signUpDate: Date;
    profileUrl: string | null;
    nickName: string | null;
    introduce: string | null;
  }) {
    this.signUpDate = signUpDate.toISOString();
    this.profileImageUrl = profileUrl;
    this.nickName = nickName;
    this.introduce = introduce;
  }
}
