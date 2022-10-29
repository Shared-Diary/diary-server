import { Body } from '@nestjs/common';

import {
  AuthController as Controller,
  Register,
} from './auth.controller.decorator';
import { RegisterRequestDto } from '../dto';
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
}
