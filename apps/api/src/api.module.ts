import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from '@app/prisma';
import { JwtModule } from '@app/jwt';

import validationSchema from './config.schema';
import { ApiController } from './api.controller';
import { AuthenticationModule } from './authentication/authentication.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`environments/.${process.env.NODE_ENV}.env`],
      isGlobal: true,
      validationSchema,
    }),
    PrismaModule,
    AuthenticationModule,
    UsersModule,
    JwtModule,
  ],
  controllers: [ApiController],
})
export class ApiModule {}
