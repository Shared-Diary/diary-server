import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { PrismaModule } from '@app/prisma';
import { JwtModule } from '@app/jwt';
import { AllExceptionsFilter } from '@app/utils/filters';

import { ApiController } from './api.controller';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './users/user.module';
import { DiaryModule } from './diary/diary.module';
import configs from './configs/modules';

const configModules = [JwtModule, PrismaModule, ...configs];
const apiModules = [AuthenticationModule, UserModule];

@Module({
  imports: [...configModules, ...apiModules, DiaryModule],
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
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class ApiModule {}
