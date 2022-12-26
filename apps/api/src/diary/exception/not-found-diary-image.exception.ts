import { NotFoundException } from '@nestjs/common';

export class NotFoundDiaryImageException extends NotFoundException {
  constructor() {
    super('일기장 이미지를 찾을 수 없습니다');
  }
}
