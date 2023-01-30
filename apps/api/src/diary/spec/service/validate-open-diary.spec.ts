import { Test, TestingModule } from '@nestjs/testing';

import { Mock } from '@app/shared/type';
import { UploadFileService } from '@app/upload-file';

import { DiaryImageRepository, DiaryRepository } from '../../repository';
import { DiaryService, DiaryServiceImpl } from '../../service';
import { DiaryEntity } from '../../entity';
import { NotFoundDiaryException } from '../../exception';

describe('공개 일기 확인', () => {
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
            findByUnique: jest.fn(),
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

  it('공개 일기장 확인', async () => {
    const mockDiary: DiaryEntity = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: true,
      isOpen: true,
      userId: 1,
      title: 'title',
      content: 'content',
    };
    diaryRepository.findByUnique.mockResolvedValue(mockDiary);

    const result = await diaryService.validateOpenDiary(1);

    expect(diaryRepository.findByUnique).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });

  it('공개된 일기장이 아닐 경우 NotFoundDiaryException 을 반환한다', async () => {
    const mockDiary = {
      status: true,
      isOpen: false,
    };

    diaryRepository.findByUnique.mockResolvedValue(mockDiary);

    await expect(async () => {
      await diaryService.validateOpenDiary(1);
    }).rejects.toThrow(new NotFoundDiaryException());
  });

  it('status 가 false 일 경우 NotFoundDiaryException 을 반환한다', async () => {
    const mockDiary = {
      status: false,
      isOpen: true,
    };
    diaryRepository.findByUnique.mockResolvedValue(mockDiary);

    await expect(async () => {
      await diaryService.validateOpenDiary(1);
    }).rejects.toThrow(new NotFoundDiaryException());
  });

  it('존재하지 않는 일기장일 경우 NotFoundDiaryException 을 반환한다', async () => {
    diaryRepository.findByUnique.mockResolvedValue(null);

    await expect(async () => {
      await diaryService.validateOpenDiary(1);
    }).rejects.toThrow(new NotFoundDiaryException());
  });
});
