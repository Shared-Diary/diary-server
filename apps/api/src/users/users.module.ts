import { Module } from '@nestjs/common';

import { UsersController } from './controller';
import { UserService, UserServiceImpl } from './service';
import { UserProfileRepository, UserRepository } from './repository';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: UserService,
      useClass: UserServiceImpl,
    },
    UserRepository,
    UserProfileRepository,
  ],
  exports: [UserService],
})
export class UsersModule {}
