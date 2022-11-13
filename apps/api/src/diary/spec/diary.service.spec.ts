import { Test, TestingModule } from '@nestjs/testing';
import { DiaryService, DiaryServiceImpl } from '../service';

describe('DiaryService', () => {
  let service: DiaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DiaryService,
          useClass: DiaryServiceImpl,
        },
      ],
    }).compile();

    service = module.get<DiaryService>(DiaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
