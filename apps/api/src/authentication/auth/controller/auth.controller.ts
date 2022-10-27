import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { RegisterRequestDto } from '../dto';
import { AuthService } from '../service';

@Controller({ path: '/auth', version: ['1'] })
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiOperation({
    summary: '회원가입 API',
  })
  async register(@Body() registerRequestDto: RegisterRequestDto) {
    await this.authService.register(registerRequestDto);

    return null;
  }
}
