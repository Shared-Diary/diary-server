import { Module } from '@nestjs/common';

import { PasswordEncoderModule } from '@app/password-encoder';

import { AuthController } from './controller';
import { AuthService, AuthServiceImpl } from './service';
import { UsersModule } from '../../users/users.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [UsersModule, PasswordEncoderModule, TokenModule],
  controllers: [AuthController],
  providers: [
    {
      provide: AuthService,
      useClass: AuthServiceImpl,
    },
  ],
})
export class AuthModule {}
