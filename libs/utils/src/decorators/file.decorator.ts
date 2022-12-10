import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';

export const File = (fileName: string) =>
  applyDecorators(
    UseInterceptors(FileInterceptor(fileName)),
    ApiConsumes('multipart/form-data'),
  );
