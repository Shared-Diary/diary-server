import { ForbiddenException } from '@nestjs/common';

export class AlreadyCreatedProfileException extends ForbiddenException {
  constructor() {
    super('이미 프로필을 생성했습니다');
  }
}
