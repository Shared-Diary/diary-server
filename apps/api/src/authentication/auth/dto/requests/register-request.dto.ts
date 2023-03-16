import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

import { Regex } from '@app/regex';

export class RegisterRequestDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(Regex.PASSWORD, {
    message: '영문, 숫자, 특수문자 포함 8 - 16 자리 비밀번호가 필요합니다',
  })
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  readonly phone: string;
}
