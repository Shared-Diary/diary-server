import { Module } from '@nestjs/common';

import { UsersController } from './controller';
import { UserService, UserServiceImpl } from './service';
import { UserRepository } from './repository';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: UserService,
      useClass: UserServiceImpl,
    },
    UserRepository,
  ],
  exports: [UserService],
})
export class UsersModule {}
