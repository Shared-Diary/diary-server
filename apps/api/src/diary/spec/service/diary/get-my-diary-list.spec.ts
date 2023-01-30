import { Test, TestingModule } from '@nestjs/testing';

import { Mock, WithTotal } from '@app/shared/type';
import { UploadFileService } from '@app/upload-file';

import { DiaryImageRepository, DiaryRepository } from '../../../repository';
import { DiaryService, DiaryServiceImpl } from '../../../service';
import { DiaryIncludeImageAndLike } from '../../../type';

describe('내 일기장 리스트 조회', () => {
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

  it('내 일기장 리스트 조회 성공', async () => {
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
          diaryImage: [
            {
              id: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
              diaryId: 1,
              imageUrl: 'url',
            },
          ],
          diaryLike: [],
        },
      ],
      1,
    ];
    await diaryRepository.findListIncludeLikeAndImage.mockResolvedValue(
      mockData,
    );

    const [diaries, total] = await diaryService.getMyDiaryList({
      userId: 1,
      page: 1,
      pageSize: 10,
    });

    expect(total).toBe(1);
    expect(diaryRepository.findListIncludeLikeAndImage).toHaveBeenCalledTimes(
      1,
    );
  });
});
