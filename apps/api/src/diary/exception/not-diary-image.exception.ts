import { ForbiddenException } from '@nestjs/common';

export class NotDiaryImageException extends ForbiddenException {
  constructor() {
    super('일기장의 이미지가 아닙니다');
  }
}
