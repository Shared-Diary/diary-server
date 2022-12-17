import { BadRequestException } from '@nestjs/common';

export class FileRequiredException extends BadRequestException {
  constructor(fileName: string) {
    super(`${fileName} 이 필요합니다`);
  }
}
