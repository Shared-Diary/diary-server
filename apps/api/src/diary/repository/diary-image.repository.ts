import { Injectable } from '@nestjs/common';

import { PrismaService } from '@app/prisma';

@Injectable()
export class DiaryImageRepository {
  constructor(private readonly prismaService: PrismaService) {}
}
