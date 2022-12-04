import { Injectable } from '@nestjs/common';

import { PrismaService } from '@app/prisma';

@Injectable()
export class UserProfileRepository {
  constructor(private readonly prismaService: PrismaService) {}
}
