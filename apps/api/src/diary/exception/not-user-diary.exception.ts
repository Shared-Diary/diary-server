import { ForbiddenException } from '@nestjs/common';

export class NotUserDiaryException extends ForbiddenException {
  constructor() {
    super('유저의 일기장이 아닙니다');
  }
}
