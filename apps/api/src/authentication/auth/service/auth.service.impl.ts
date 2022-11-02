import { Injectable } from '@nestjs/common';

import { PasswordEncoderService } from '@app/password-encoder';

import { AuthService } from './auth.service';
import {
  LoginUserRequestDto,
  LoginUserResponseDto,
  RegisterRequestDto,
} from '../dto';
import { UsersService } from '../../../users/service';
import { PasswordMismatchException } from '../exception';

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordEncoderService: PasswordEncoderService,
  ) {}

  async register({ email, password }: RegisterRequestDto): Promise<void> {
    await this.usersService.createUser({
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
    const { password: hashedPassword } =
      await this.usersService.findUserByEmail(email);

    await this.validatePasswordMatch(password, hashedPassword);

    return {
      accessToken: '',
      refreshToken: '',
    };
  }
}
