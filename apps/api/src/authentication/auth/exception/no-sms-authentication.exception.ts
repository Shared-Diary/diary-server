import { ForbiddenException } from '@nestjs/common';

export class NoSmsAuthenticationException extends ForbiddenException {
  constructor() {
    super('Sms 인증이 되지 않았거나 만료되어 회원가입이 가능합니다');
  }
}
