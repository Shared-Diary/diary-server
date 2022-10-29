import { Module } from '@nestjs/common';

import { PasswordEncoderModule } from '@app/password-encoder';

import { UsersController } from './controller';
import { UsersService, UsersServiceImpl } from './service';
import { UsersRepository } from './repository';

@Module({
  imports: [PasswordEncoderModule],
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
