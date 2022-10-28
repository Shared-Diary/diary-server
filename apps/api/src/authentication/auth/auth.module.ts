import { Module } from '@nestjs/common';

import { AuthController } from './controller';
import { AuthService, AuthServiceImpl } from './service';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [
    {
      provide: AuthService,
      useClass: AuthServiceImpl,
    },
  ],
})
export class AuthModule {}
