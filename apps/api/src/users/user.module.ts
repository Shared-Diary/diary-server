import { Module } from '@nestjs/common';

import { UserController } from './controller';
import { UserService, UserServiceImpl } from './service';
import { UserProfileRepository, UserRepository } from './repository';

@Module({
  controllers: [UserController],
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
export class UserModule {}
