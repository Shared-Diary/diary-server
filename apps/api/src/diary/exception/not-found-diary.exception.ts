import { NotFoundException } from '@nestjs/common';

export class NotFoundDiaryException extends NotFoundException {
  constructor() {
    super('일기장을 찾을 수 없습니다');
  }
}
