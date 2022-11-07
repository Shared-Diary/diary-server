import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { PrismaModule } from '@app/prisma';
import { JwtModule } from '@app/jwt';

import { ApiController } from './api.controller';
import { AuthenticationModule } from './authentication/authentication.module';
import { UsersModule } from './users/users.module';
import configs from './configs';

const configModules = [JwtModule, PrismaModule, ...configs];

const apiModules = [AuthenticationModule, UsersModule];

@Module({
  imports: [...configModules, ...apiModules],
  controllers: [ApiController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class ApiModule {}
