import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from '@app/prisma';

import validationSchema from './config.schema';
import { ApiController } from './api.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`environments/.${process.env.NODE_ENV}.env`],
      isGlobal: true,
      validationSchema,
    }),
    PrismaModule,
  ],
  controllers: [ApiController],
})
export class ApiModule {}
