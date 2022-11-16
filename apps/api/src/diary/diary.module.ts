import { Module } from '@nestjs/common';

import { DiaryController } from './controller';
import { DiaryServiceImpl, DiaryService } from './service';
import { DiaryRepository } from './repository';

@Module({
  controllers: [DiaryController],
  providers: [
    {
      provide: DiaryService,
      useClass: DiaryServiceImpl,
    },
    DiaryRepository,
  ],
})
export class DiaryModule {}
