import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`environments/.${process.env.NODE_ENV}.env`],
      isGlobal: true,
    }),
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
