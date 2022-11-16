import { Test, TestingModule } from '@nestjs/testing';
import { DiaryController } from '../controller';
import { DiaryService } from '../service';

describe('DiaryController', () => {
  let controller: DiaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiaryController],
      providers: [
        {
          provide: DiaryService,
          useFactory: () => ({}),
        },
      ],
    }).compile();

    controller = module.get<DiaryController>(DiaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});