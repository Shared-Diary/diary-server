import { Module } from '@nestjs/common';

import { UploadFileModule } from '@app/upload-file';

import { DiaryController } from './controller';
import {
  DiaryServiceImpl,
  DiaryService,
  DiaryLikeService,
  DiaryLikeServiceImpl,
} from './service';
import { DiaryRepository, DiaryImageRepository } from './repository';

@Module({
  imports: [UploadFileModule],
  controllers: [DiaryController],
  providers: [
    {
      provide: DiaryService,
      useClass: DiaryServiceImpl,
    },
    {
      provide: DiaryLikeService,
      useClass: DiaryLikeServiceImpl,
    },
    DiaryRepository,
    DiaryImageRepository,
  ],
})
export class DiaryModule {}
