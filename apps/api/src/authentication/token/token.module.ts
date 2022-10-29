import { Module } from '@nestjs/common';

import { AccessTokenService, AccessTokenServiceImpl } from './service';

@Module({
  providers: [
    {
      provide: AccessTokenService,
      useClass: AccessTokenServiceImpl,
    },
  ],
  exports: [AccessTokenService],
})
export class TokenModule {}
