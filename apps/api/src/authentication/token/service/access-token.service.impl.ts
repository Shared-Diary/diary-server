import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { InvalidAccessTokenFormatException } from '../exception';
import { AccessTokenService } from './access-token.service';

@Injectable()
export class AccessTokenServiceImpl implements AccessTokenService {
  constructor(@Inject('JwtService') private readonly jwtService: JwtService) {}

  generateAccessToken(payload: { userId: number }): string {
    if (!payload.userId) {
      throw new InvalidAccessTokenFormatException();
    }
    return this.jwtService.sign(payload);
  }
}
