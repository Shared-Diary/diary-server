export abstract class AccessTokenService {
  abstract generateAccessToken(payload: { userId: number }): string;
}
