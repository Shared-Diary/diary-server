import { Module } from '@nestjs/common';

import { UsersController } from './controller';
import { UsersService, UsersServiceImpl } from './service';
import { UsersRepository } from './repository';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: UsersService,
      useClass: UsersServiceImpl,
    },
    UsersRepository,
  ],
  exports: [UsersService],
})
export class UsersModule {}
