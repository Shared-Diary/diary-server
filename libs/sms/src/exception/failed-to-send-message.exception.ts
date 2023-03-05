import { InternalServerErrorException } from '@nestjs/common';

export class FailedToSendMessageException extends InternalServerErrorException {
  constructor() {
    super('SMS 메시지 전송 실패');
  }
}
