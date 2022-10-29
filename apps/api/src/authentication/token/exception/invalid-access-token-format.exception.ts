import { BadRequestException } from '@nestjs/common';

export class InvalidAccessTokenFormatException extends BadRequestException {
  constructor() {
    super('잘못된 Access Token 형식 입니다');
  }
}
