export class LoginUserResponseDto {
  readonly accessToken: string;

  readonly refreshToken: string;

  constructor(partial: Partial<LoginUserResponseDto>) {
    Object.assign(this, partial);
  }
}
