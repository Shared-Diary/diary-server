import { Test, TestingModule } from '@nestjs/testing';

import { Mock, WithTotal } from '@app/shared/type';
import { UploadFileService } from '@app/upload-file';

import { DiaryImageRepository, DiaryRepository } from '../repository';
import { DiaryService, DiaryServiceImpl } from '../service';
import { DiaryIncludeImageAndLike } from '../type';

describe('다이어리 리스트 조회', () => {
  let diaryService: DiaryService;
  let diaryRepository: Mock<DiaryRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DiaryService,
          useClass: DiaryServiceImpl,
        },
        {
          provide: DiaryRepository,
          useFactory: () => ({
            findListIncludeLikeAndImage: jest.fn(),
          }),
        },
        {
          provide: DiaryImageRepository,
          useFactory: () => ({}),
        },
        {
          provide: UploadFileService,
          useFactory: () => ({}),
        },
      ],
    }).compile();

    diaryService = module.get<DiaryService>(DiaryService);
    diaryRepository = module.get(DiaryRepository);
  });

  it('다이어리 리스트 조회 성공', async () => {
    const mockData: WithTotal<DiaryIncludeImageAndLike[]> = [
      [
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: true,
          isOpen: true,
          userId: 1,
          title: 'title',
          content: 'content',
          diaryImage: [],
          diaryLike: [],
        },
      ],
      1,
    ];
    diaryRepository.findListIncludeLikeAndImage.mockResolvedValue(mockData);

    const [diaries, total] = await diaryService.getDiaryList({
      page: 1,
      pageSize: 10,
    });
    expect(Array.isArray(diaries)).toBe(true);
    expect(diaryRepository.findListIncludeLikeAndImage).toHaveBeenCalledTimes(
      1,
    );
    expect(total).toBe(1);
  });
});
