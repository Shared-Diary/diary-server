import { Module } from '@nestjs/common';

import { UsersController } from './controller';
import { UsersService, UsersServiceImpl } from './service';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: UsersService,
      useClass: UsersServiceImpl,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
