import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@app/prisma';
import { UploadFileService } from '@app/upload-file';

import { DiaryService, DiaryServiceImpl } from '../service';
import { DiaryImageRepository, DiaryRepository } from '../repository';

describe('DiaryService', () => {
  let diaryService: DiaryService;

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
        {
          provide: DiaryImageRepository,
          useFactory: () => ({}),
        },
        {
          provide: UploadFileService,
          useFactory: () => ({}),
        },
        PrismaService,
      ],
    }).compile();

    diaryService = module.get<DiaryService>(DiaryService);
  });

  it('should be defined', () => {
    expect(diaryService).toBeDefined();
  });
});
