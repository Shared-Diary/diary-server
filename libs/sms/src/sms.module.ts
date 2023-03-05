import { Module } from '@nestjs/common';

import { SmsService, SmsServiceImpl } from './service';

@Module({
  providers: [
    {
      provide: SmsService,
      useClass: SmsServiceImpl,
    },
  ],
  exports: [SmsService],
})
export class SmsModule {}
