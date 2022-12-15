export class JwtRequestDto {
  readonly userId: number;

  readonly iat: number;

  readonly exp: number;
}
