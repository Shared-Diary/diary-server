import { Module } from '@nestjs/common';

import { TwilloModule } from '@app/twillo';

import { SmsService, SmsServiceImpl } from './service';

@Module({
  imports: [TwilloModule],
  providers: [
    {
      provide: SmsService,
      useClass: SmsServiceImpl,
    },
  ],
  exports: [SmsService],
})
export class SmsModule {}
