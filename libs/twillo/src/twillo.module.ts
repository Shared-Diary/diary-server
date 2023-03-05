import { Module } from '@nestjs/common';
import { TwilloConfigProvider } from './twillo-config.provider';

@Module({
  providers: [TwilloConfigProvider],
  exports: [TwilloConfigProvider],
})
export class TwilloModule {}
