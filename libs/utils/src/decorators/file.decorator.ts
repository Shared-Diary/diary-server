import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import {
  MulterField,
  MulterOptions,
} from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const FileRequest = (fileName: string, localOptions?: MulterOptions) =>
  applyDecorators(
    UseInterceptors(FileInterceptor(fileName, localOptions)),
    ApiConsumes('multipart/form-data'),
  );

export const FilesRequest = (
  uploadFields: MulterField[],
  localOptions?: MulterOptions,
) =>
  applyDecorators(
    UseInterceptors(FileFieldsInterceptor(uploadFields, localOptions)),
    ApiConsumes('multipart/form-data'),
  );
