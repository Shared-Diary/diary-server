import { Injectable } from '@nestjs/common';

import { PasswordEncoderService } from '@app/password-encoder';

import { SmsService } from '@app/sms';
import { CacheService } from '@app/cache';

import { AuthService } from './auth.service';
import {
  LoginUserRequestDto,
  RegisterRequestDto,
  SendSmsRequestDto,
  VerifySmsCodeRequestDto,
} from '../dto/requests';
import { UserService } from '../../../user/service';
import {
  NoSmsAuthenticationException,
  PasswordMismatchException,
  VerificationCodeMismatchException,
} from '../exception';
import { AccessTokenService } from '../../token/service';
import { GetUserTokens } from '../type';

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordEncoderService: PasswordEncoderService,
    private readonly accessTokenService: AccessTokenService,
    private readonly smsService: SmsService,
    private readonly cacheService: CacheService,
  ) {}

  async register({
    email,
    password,
    phone,
  }: RegisterRequestDto): Promise<void> {
    await this.validateSmsAuth(phone);

    await this.userService.createUser({
      email,
      password: await this.passwordEncoderService.encode(password),
    });
  }

  private async validateSmsAuth(phone: string) {
    const isOk = await this.cacheService.get<string>(`register:auth:${phone}`);
    if (!isOk || isOk !== 'ok') {
      throw new NoSmsAuthenticationException();
    }
    await this.cacheService.delete(`register:auth:${phone}`);
  }

  private async validatePassword(
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

    await this.validatePassword(password, hashedPassword);

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

    await this.cacheService.set<number>(`sms:auth:${recipientNo}`, randomCode, {
      ttl: 180,
    });
  }

  private generateRandomCode() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  async verifySmsCode({
    recipientNo,
    code,
  }: VerifySmsCodeRequestDto): Promise<void> {
    const smsCode = await this.cacheService.get<number>(
      `sms:auth:${recipientNo}`,
    );
    if (!smsCode || code !== smsCode) {
      throw new VerificationCodeMismatchException();
    }
    await this.cacheService.delete(`sms:auth:${recipientNo}`);

    await this.setRegisterIsPossible(recipientNo);
  }

  private async setRegisterIsPossible(recipientNo: string): Promise<void> {
    await this.cacheService.set<string>(`register:auth:${recipientNo}`, 'ok', {
      ttl: 300,
    });
  }
}
