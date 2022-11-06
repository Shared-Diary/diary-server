import { applyDecorators, Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Injectable()
class JwtAuthGuard extends AuthGuard('jwt') {}

export const JwtAuth = () =>
  applyDecorators(UseGuards(JwtAuthGuard), ApiBearerAuth());
