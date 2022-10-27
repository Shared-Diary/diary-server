import { Module } from '@nestjs/common';

import { AuthController } from './controller';
import { AuthService, AuthServiceImpl } from './service';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: AuthService,
      useClass: AuthServiceImpl,
    },
  ],
})
export class AuthModule {}
