import { InternalServerErrorException } from '@nestjs/common';

export class DatabaseErrorException extends InternalServerErrorException {
  constructor() {
    super('Prisma Database Error');
  }
}
