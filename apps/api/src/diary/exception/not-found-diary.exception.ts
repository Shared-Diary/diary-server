import { NotFoundException } from '@nestjs/common';

export class NotFoundDiaryException extends NotFoundException {
  constructor() {
    super('다이어리를 찾을 수 없습니다');
  }
}
