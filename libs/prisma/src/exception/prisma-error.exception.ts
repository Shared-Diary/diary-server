import { InternalServerErrorException } from '@nestjs/common';

export class PrismaErrorException extends InternalServerErrorException {
  constructor(errorCode: unknown) {
    super(`Database Error - ${errorCode}`);
  }
}
