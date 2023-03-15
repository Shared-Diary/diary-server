import { Injectable } from '@nestjs/common';

import { PasswordEncoderService } from '@app/password-encoder';

import { SmsService } from '@app/sms';

import { AuthService } from './auth.service';
import {
  LoginUserRequestDto,
  RegisterRequestDto,
  SendSmsRequestDto,
} from '../dto/requests';
import { UserService } from '../../../user/service';
import { PasswordMismatchException } from '../exception';
import { AccessTokenService } from '../../token/service';
import { GetUserTokens } from '../type';

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordEncoderService: PasswordEncoderService,
    private readonly accessTokenService: AccessTokenService,
    private readonly smsService: SmsService,
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
  }: LoginUserRequestDto): Promise<GetUserTokens> {
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

  async sendAuthSms({ recipientNo }: SendSmsRequestDto): Promise<void> {
    const randomCode = this.generateRandomCode();
    await this.smsService.sendMessage(
      recipientNo,
      `[${randomCode}] Diary Service 에서 전송한 인증번호입니다`,
    );
  }

  private generateRandomCode() {
    return Math.floor(100000 + Math.random() * 900000);
  }
}
