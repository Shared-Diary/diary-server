import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { InvalidAccessTokenFormatException } from './exception';

@Injectable()
export class AccessTokenService {
  constructor(@Inject('JwtService') private readonly jwtService: JwtService) {}

  generateAccessToken(payload: { userId: number }) {
    if (!payload.userId) {
      throw new InvalidAccessTokenFormatException();
    }
    return this.jwtService.sign(payload);
  }
}
