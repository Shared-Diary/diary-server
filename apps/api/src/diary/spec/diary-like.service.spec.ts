import { Test, TestingModule } from '@nestjs/testing';

import { Mock } from '@app/shared/type';

import {
  DiaryLikeService,
  DiaryLikeServiceImpl,
  DiaryService,
} from '../service';
import { DiaryLikeRepository } from '../repository';

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
            findByUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findListByDiaryId: jest.fn(),
          }),
        },
        {
          provide: DiaryService,
          useFactory: () => ({
            validateOpenDiary: jest.fn(),
            validateExistDiary: jest.fn(),
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

  describe('getDiaryLikeUserList', () => {
    it('일기장 좋아요 리스트 조회 시 일기장 존재 여부 체크를 해야 한다', async () => {
      const MockDiaryLikes = 'data';
      diaryLikeRepository.findListByDiaryId.mockResolvedValue(MockDiaryLikes);

      const diaryLikes = await diaryLikeService.getDiaryLikeUserList({
        diaryId: 1,
        page: 1,
        pageSize: 10,
      });

      expect(diaryLikes).toBe(MockDiaryLikes);
      expect(diaryService.validateExistDiary).toHaveBeenCalledTimes(1);
    });
  });
});
