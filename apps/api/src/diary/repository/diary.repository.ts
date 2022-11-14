import { Injectable } from '@nestjs/common';

import { PrismaService } from '@app/prisma';

@Injectable()
export class DiaryRepository {
  constructor(private readonly prismaService: PrismaService) {}
}
