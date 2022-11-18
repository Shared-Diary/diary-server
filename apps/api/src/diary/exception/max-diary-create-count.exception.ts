import { ForbiddenException } from '@nestjs/common';

export class MaxDiaryCreateCountException extends ForbiddenException {
  constructor(maxCount: number) {
    super(`일일 일기장 최대 생성 개수는 ${maxCount}개 입니다`);
  }
}
