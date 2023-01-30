import { Test, TestingModule } from '@nestjs/testing';

import { Mock } from '@app/shared/type';

import {
  DiaryLikeService,
  DiaryLikeServiceImpl,
  DiaryService,
} from '../../../service';
import { DiaryLikeRepository } from '../../../repository';

describe('일기 좋아요', () => {
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
            findByUnique: jest.fn(),
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

  it('일기장 좋아요가 없다면 생성한다', async () => {
    diaryService.validateOpenDiary.mockResolvedValue(undefined);
    diaryLikeRepository.findByUnique.mockResolvedValue(null);

    const result = await diaryLikeService.createOrUpdateDiaryLikes(
      { diaryId: 1 },
      1,
    );

    expect(result).toBeUndefined();
    expect(diaryService.validateOpenDiary).toHaveBeenCalledTimes(1);
    expect(diaryLikeRepository.create).toHaveBeenCalledTimes(1);
    expect(diaryLikeRepository.update).toHaveBeenCalledTimes(0);
  });

  it('일기장 좋아요가 이미 있다면 업데이트한다', async () => {
    diaryService.validateOpenDiary.mockResolvedValue(undefined);
    diaryLikeRepository.findByUnique.mockResolvedValue('diaryLike');

    const result = await diaryLikeService.createOrUpdateDiaryLikes(
      { diaryId: 1 },
      1,
    );

    expect(result).toBeUndefined();
    expect(diaryService.validateOpenDiary).toHaveBeenCalledTimes(1);
    expect(diaryLikeRepository.create).toHaveBeenCalledTimes(0);
    expect(diaryLikeRepository.update).toHaveBeenCalledTimes(1);
  });
});
