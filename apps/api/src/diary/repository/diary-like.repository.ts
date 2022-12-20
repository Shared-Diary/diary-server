import { Injectable } from '@nestjs/common';

import { PrismaService } from '@app/prisma';

@Injectable()
export class DiaryLikeRepository {
  constructor(private readonly prismaService: PrismaService) {}
}
