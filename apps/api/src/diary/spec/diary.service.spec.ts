import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@app/prisma';

import { DiaryService, DiaryServiceImpl } from '../service';
import { DiaryRepository } from '../repository';

describe('DiaryService', () => {
  let service: DiaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DiaryService,
          useClass: DiaryServiceImpl,
        },
        {
          provide: DiaryRepository,
          useFactory: () => ({}),
        },
        PrismaService,
      ],
    }).compile();

    service = module.get<DiaryService>(DiaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
