import { NotFoundException } from '@nestjs/common';

export class NotFoundUserException extends NotFoundException {
  constructor() {
    super('존재하지 않는 유저입니다');
  }
}
