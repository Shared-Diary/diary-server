import { Module } from '@nestjs/common';

import {
  PasswordEncoderService,
  BcryptPasswordEncoderService,
} from './service';

@Module({
  providers: [
    {
      provide: PasswordEncoderService,
      useClass: BcryptPasswordEncoderService,
    },
  ],
  exports: [PasswordEncoderService],
})
export class PasswordEncoderModule {}
