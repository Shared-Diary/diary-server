import { Test, TestingModule } from '@nestjs/testing';

import { DiaryController } from '../../controller';
import { DiaryLikeService, DiaryService } from '../../service';
import ThrottlerModule from '../../../configs/modules/throttler.module';

describe('DiaryController', () => {
  let controller: DiaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ThrottlerModule],
      controllers: [DiaryController],
      providers: [
        {
          provide: DiaryService,
          useFactory: () => ({}),
        },
        {
          provide: DiaryLikeService,
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
