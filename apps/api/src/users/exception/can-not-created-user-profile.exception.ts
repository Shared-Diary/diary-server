import { ForbiddenException } from '@nestjs/common';

export class CanNotCreatedUserProfileException extends ForbiddenException {
  constructor() {
    super('유저 프로필이 이미 생성되어 있습니다');
  }
}
