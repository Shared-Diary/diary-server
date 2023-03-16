import { Body } from '@nestjs/common';

import {
  AuthController as Controller,
  Register,
  LoginUser,
  SendSms,
  VerifySmsCode,
} from './auth.controller.decorator';
import {
  LoginUserRequestDto,
  RegisterRequestDto,
  SendSmsRequestDto,
  VerifySmsCodeRequestDto,
} from '../dto/requests';
import { AuthService } from '../service';
import { LoginUserResponseDto } from '../dto/responses';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Register()
  async register(
    @Body() registerRequestDto: RegisterRequestDto,
  ): Promise<null> {
    await this.authService.register(registerRequestDto);

    return null;
  }

  @LoginUser()
  async loginUser(@Body() loginUserRequestDto: LoginUserRequestDto) {
    const userTokens = await this.authService.loginUser(loginUserRequestDto);

    return new LoginUserResponseDto(userTokens);
  }

  @SendSms()
  async sendSms(@Body() sendSmsRequestDto: SendSmsRequestDto): Promise<null> {
    await this.authService.sendAuthSms(sendSmsRequestDto);

    return null;
  }

  @VerifySmsCode()
  async verifySmsCode(
    @Body() verifySmsCodeRequestDto: VerifySmsCodeRequestDto,
  ): Promise<null> {
    return null;
  }
}
