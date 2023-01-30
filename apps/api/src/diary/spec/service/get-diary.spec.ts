import { Test, TestingModule } from '@nestjs/testing';

import { Mock } from '@app/shared/type';
import { UploadFileService } from '@app/upload-file';

import { DiaryImageRepository, DiaryRepository } from '../../repository';
import { DiaryService, DiaryServiceImpl } from '../../service';
import { DiaryIncludeImageAndLike } from '../../type';
import { NotFoundDiaryException } from '../../exception';

describe('일기 상세 조회', () => {
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
            findIncludeLikeAndImage: jest.fn(),
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

  it('일기 상세 조회 성공', async () => {
    const mockDiary: DiaryIncludeImageAndLike = {
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
    };
    diaryRepository.findIncludeLikeAndImage.mockResolvedValue(mockDiary);

    const { diaryLike, diaryImage, ...diary } = await diaryService.getDiary({
      diaryId: 1,
    });

    expect(diaryRepository.findIncludeLikeAndImage).toHaveBeenCalledTimes(1);
    expect(diary.status).toBe(true);
    expect(diary.isOpen).toBe(true);
  });

  it('공개된 일기장이 아닐 경우 NotFoundDiaryException 을 반환한다', async () => {
    const mockData = {
      status: true,
      isOpen: false,
    };

    diaryRepository.findIncludeLikeAndImage.mockResolvedValue(mockData);

    await expect(async () => {
      await diaryService.getDiary({
        diaryId: 1,
      });
    }).rejects.toThrow(new NotFoundDiaryException());
  });

  it('status 가 false 일 경우 NotFoundDiaryException 을 반환한다', async () => {
    const mockData = {
      status: false,
      isOpen: true,
    };
    diaryRepository.findIncludeLikeAndImage.mockResolvedValue(mockData);

    await expect(async () => {
      await diaryService.getDiary({
        diaryId: 1,
      });
    }).rejects.toThrow(new NotFoundDiaryException());
  });

  it('존재하지 않는 일기장일 경우 NotFoundDiaryException 을 반환한다', async () => {
    diaryRepository.findIncludeLikeAndImage.mockResolvedValue(null);

    await expect(async () => {
      await diaryService.getDiary({
        diaryId: 1,
      });
    }).rejects.toThrow(new NotFoundDiaryException());
  });
});
