import { Module } from '@nestjs/common';

import { PasswordEncoderModule } from '@app/password-encoder';

import { SmsModule } from '@app/sms';

import { AuthController } from './controller';
import { AuthService, AuthServiceImpl } from './service';
import { UserModule } from '../../user/user.module';
import { TokenModule } from '../token/token.module';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [UserModule, PasswordEncoderModule, TokenModule, SmsModule],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    {
      provide: AuthService,
      useClass: AuthServiceImpl,
    },
  ],
})
export class AuthModule {}
