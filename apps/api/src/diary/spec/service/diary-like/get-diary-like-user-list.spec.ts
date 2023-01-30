import { Test, TestingModule } from '@nestjs/testing';

import { Mock } from '@app/shared/type';

import {
  DiaryLikeService,
  DiaryLikeServiceImpl,
  DiaryService,
} from '../../../service';
import { DiaryLikeRepository } from '../../../repository';

describe('일기 좋아요 유저 리스트 조회', () => {
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
            findListWithTotal: jest.fn(),
          }),
        },
        {
          provide: DiaryService,
          useFactory: () => ({
            validateExistDiary: jest.fn(),
          }),
        },
      ],
    }).compile();

    diaryLikeService = module.get<DiaryLikeService>(DiaryLikeService);
    diaryLikeRepository = module.get(DiaryLikeRepository);
    diaryService = module.get(DiaryService);
  });

  it('일기장 좋아요 리스트 조회 시 일기장 존재 여부 체크를 해야 한다', async () => {
    const mockDiaryLikes = 'data';
    diaryLikeRepository.findListWithTotal.mockResolvedValue(mockDiaryLikes);

    const diaryLikes = await diaryLikeService.getDiaryLikeUserList({
      diaryId: 1,
      page: 1,
      pageSize: 10,
    });

    expect(diaryLikes).toBe(mockDiaryLikes);
    expect(diaryService.validateExistDiary).toHaveBeenCalledTimes(1);
  });
});
