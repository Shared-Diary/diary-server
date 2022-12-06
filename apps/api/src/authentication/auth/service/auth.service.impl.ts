import { Injectable } from '@nestjs/common';

import { PasswordEncoderService } from '@app/password-encoder';

import { AuthService } from './auth.service';
import {
  LoginUserRequestDto,
  LoginUserResponseDto,
  RegisterRequestDto,
} from '../dto';
import { UserService } from '../../../user/service';
import { PasswordMismatchException } from '../exception';
import { AccessTokenService } from '../../token/service';

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordEncoderService: PasswordEncoderService,
    private readonly accessTokenService: AccessTokenService,
  ) {}

  async register({ email, password }: RegisterRequestDto): Promise<void> {
    await this.userService.createUser({
      email,
      password: await this.passwordEncoderService.encode(password),
    });
  }

  private async validatePasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<void> {
    const isMatched = await this.passwordEncoderService.isMatches(
      password,
      hashedPassword,
    );
    if (!isMatched) {
      throw new PasswordMismatchException();
    }
  }

  async loginUser({
    email,
    password,
  }: LoginUserRequestDto): Promise<LoginUserResponseDto> {
    const { id: userId, password: hashedPassword } =
      await this.userService.findUserByEmail(email);

    await this.validatePasswordMatch(password, hashedPassword);

    return {
      accessToken: this.accessTokenService.generateAccessToken({
        userId,
      }),
      refreshToken: '',
    };
  }
}
