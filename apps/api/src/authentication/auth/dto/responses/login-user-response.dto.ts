import { GetUserTokens } from '../../type';

export class LoginUserResponseDto {
  readonly accessToken: string;

  readonly refreshToken: string;

  constructor(userTokens: Partial<GetUserTokens>) {
    this.accessToken = userTokens.accessToken;
    this.refreshToken = userTokens.refreshToken;
  }
}
