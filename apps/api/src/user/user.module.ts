import { Module } from '@nestjs/common';

import { UploadFileModule } from '@app/upload-file';

import { UserController } from './controller';
import { UserService, UserServiceImpl } from './service';
import { UserRepository } from './repository';

@Module({
  imports: [UploadFileModule],
  controllers: [UserController],
  providers: [
    {
      provide: UserService,
      useClass: UserServiceImpl,
    },
    UserRepository,
  ],
  exports: [UserService],
})
export class UserModule {}
