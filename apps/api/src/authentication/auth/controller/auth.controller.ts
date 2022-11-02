import { Body } from '@nestjs/common';

import {
  AuthController as Controller,
  Register,
  LoginUser,
} from './auth.controller.decorator';
import { LoginUserRequestDto, LoginUserResponseDto, RegisterRequestDto } from "../dto";
import { AuthService } from '../service';

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
    const result = await this.authService.loginUser(loginUserRequestDto);

    return new LoginUserResponseDto(result);
  }
}
