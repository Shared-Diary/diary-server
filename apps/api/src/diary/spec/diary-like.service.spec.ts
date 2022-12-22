import { Test, TestingModule } from '@nestjs/testing';

import { Mock } from '@app/shared/type';

import {
  DiaryLikeService,
  DiaryLikeServiceImpl,
  DiaryService,
} from '../service';
import { DiaryLikeRepository } from '../repository';
import { DiaryLikeEntity } from '../entity';

describe('DiaryLikeService', () => {
  let diaryLikeService: DiaryLikeService;
  let diaryLikeRepository: Mock<DiaryLikeRepository>;
  let diaryService: Mock<DiaryService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DiaryLikeService,
          useClass: DiaryLikeServiceImpl,
        },
        {
          provide: DiaryLikeRepository,
          useFactory: () => ({
            findUserLike: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          }),
        },
        {
          provide: DiaryService,
          useFactory: () => ({
            validateOpenDiary: jest.fn(),
          }),
        },
      ],
    }).compile();

    diaryLikeService = module.get<DiaryLikeService>(DiaryLikeService);
    diaryLikeRepository = module.get(DiaryLikeRepository);
    diaryService = module.get(DiaryService);
  });

  it('should be defined', () => {
    expect(diaryLikeService).toBeDefined();
  });

  describe('createOrUpdateDiaryLikes', () => {
    it('첫 일기장 좋아요', async () => {
      diaryService.validateOpenDiary.mockResolvedValue(undefined);
      diaryLikeRepository.findUserLike.mockResolvedValue(null);

      const result = await diaryLikeService.createOrUpdateDiaryLikes(
        { diaryId: 1 },
        1,
      );

      expect(result).toBeUndefined();
      expect(diaryService.validateOpenDiary).toHaveBeenCalledTimes(1);
      expect(diaryLikeRepository.create).toHaveBeenCalledTimes(1);
      expect(diaryLikeRepository.update).toHaveBeenCalledTimes(0);
    });
  });
});
