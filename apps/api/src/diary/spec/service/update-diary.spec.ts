import { Test, TestingModule } from '@nestjs/testing';

import { Mock } from '@app/shared/type';
import { UploadFileService } from '@app/upload-file';

import { DiaryImageRepository, DiaryRepository } from '../../repository';
import { DiaryService, DiaryServiceImpl } from '../../service';
import { DiaryEntity } from '../../entity';
import { NotFoundDiaryException, NotUserDiaryException } from '../../exception';

describe('', () => {
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
            update: jest.fn(),
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

  it('일기장 업데이트 성공', async () => {
    const mockDiary: DiaryEntity = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: true,
      userId: 1,
      title: 'title',
      content: 'content',
      isOpen: true,
    };
    diaryRepository.findByUnique.mockResolvedValue(mockDiary);

    const result = await diaryService.updateDiary({
      userId: 1,
      bodyDto: {
        title: 'new title',
        content: 'new content',
        isOpen: false,
      },
      diaryId: 1,
    });

    expect(result).toBeUndefined();
    expect(diaryRepository.update).toHaveBeenCalledTimes(1);
  });

  it('없는 일기장일 경우 NotFoundDiaryException 을 호출한다', async () => {
    diaryRepository.findByUnique.mockResolvedValue(null);

    await expect(async () => {
      await diaryService.updateDiary({
        userId: 1,
        bodyDto: {
          title: 'new title',
          content: 'new content',
          isOpen: false,
        },
        diaryId: 2,
      });
    }).rejects.toThrow(new NotFoundDiaryException());
  });

  it('일기장 status 가 false 인 경우 NotFoundDiaryException 을 호출한다', async () => {
    const mockDiary: DiaryEntity = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: false,
      userId: 1,
      title: 'title',
      content: 'content',
      isOpen: true,
    };
    diaryRepository.findByUnique.mockResolvedValue(mockDiary);

    await expect(async () => {
      await diaryService.updateDiary({
        userId: 1,
        bodyDto: {
          title: 'new title',
          content: 'new content',
          isOpen: false,
        },
        diaryId: 2,
      });
    }).rejects.toThrow(new NotFoundDiaryException());
  });

  it('유저의 일기장이 아닐 경우 NotUserDiaryException 을 호출한다', async () => {
    const mockDiary: DiaryEntity = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: true,
      userId: 2,
      title: 'title',
      content: 'content',
      isOpen: true,
    };
    diaryRepository.findByUnique.mockResolvedValue(mockDiary);

    await expect(async () => {
      await diaryService.updateDiary({
        userId: 1,
        bodyDto: {
          title: 'new title',
          content: 'new content',
          isOpen: false,
        },
        diaryId: 2,
      });
    }).rejects.toThrow(new NotUserDiaryException());
  });
});
