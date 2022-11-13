import { Module } from '@nestjs/common';

import { DiaryController } from './controller';
import { DiaryServiceImpl, DiaryService } from './service';

@Module({
  controllers: [DiaryController],
  providers: [
    {
      provide: DiaryService,
      useClass: DiaryServiceImpl,
    },
  ],
})
export class DiaryModule {}
