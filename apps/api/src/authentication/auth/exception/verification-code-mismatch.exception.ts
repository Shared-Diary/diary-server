import { UnauthorizedException } from '@nestjs/common';

export class VerificationCodeMismatchException extends UnauthorizedException {
  constructor() {
    super('인증코드가 일치하지 않거나 유효기간이 지났습니다');
  }
}
