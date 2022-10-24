import { Module } from '@nestjs/common';
import { JwtModule as Jwt, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    Jwt.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('ACCESS_TOKEN_SECRET'),
        },
      }),
    }),
  ],
  providers: [
    {
      provide: 'JwtService',
      useExisting: JwtService,
    },
  ],
  exports: ['JwtService'],
})
export class JwtModule {}
