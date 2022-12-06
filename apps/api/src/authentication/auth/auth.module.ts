import { Module } from '@nestjs/common';

import { PasswordEncoderModule } from '@app/password-encoder';

import { AuthController } from './controller';
import { AuthService, AuthServiceImpl } from './service';
import { UserModule } from '../../users/user.module';
import { TokenModule } from '../token/token.module';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [UserModule, PasswordEncoderModule, TokenModule],
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
