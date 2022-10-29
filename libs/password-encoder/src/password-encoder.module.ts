import { Module } from '@nestjs/common';

import {
  BcryptPasswordEncoderService,
  IPasswordEncoder,
} from './service';

@Module({
  providers: [
    {
      provide: IPasswordEncoder,
      useClass: BcryptPasswordEncoderService,
    },
  ],
  exports: [IPasswordEncoder],
})
export class PasswordEncoderModule {}
