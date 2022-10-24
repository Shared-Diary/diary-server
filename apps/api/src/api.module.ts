import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from '@app/prisma';

import validationSchema from './config.schema';
import { ApiController } from './api.controller';
import { AuthenticationModule } from './authentication/authentication.module';
import { ApiService } from './api/api.service';
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
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
