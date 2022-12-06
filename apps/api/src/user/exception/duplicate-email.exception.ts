import { ConflictException } from '@nestjs/common';

export class DuplicateEmailException extends ConflictException {
  constructor() {
    super('중복된 이메일입니다');
  }
}
