import { Test, TestingModule } from '@nestjs/testing';

import { Mock } from '@app/shared/type';
import { UploadFileService } from '@app/upload-file';

import { DiaryImageRepository, DiaryRepository } from '../../../repository';
import { DiaryService, DiaryServiceImpl } from '../../../service';
import { DiaryEntity, DiaryImageEntity } from '../../../entity';
import {
  NotDiaryImageException,
  NotFoundDiaryException,
  NotFoundDiaryImageException,
  NotUserDiaryException,
} from '../../../exception';

describe('일기 이미지 삭제', () => {
  let diaryService: DiaryService;
  let diaryRepository: Mock<DiaryRepository>;
  let diaryImageRepository: Mock<DiaryImageRepository>;

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
          useFactory: () => ({
            findByUnique: jest.fn(),
            delete: jest.fn(),
          }),
        },
        {
          provide: UploadFileService,
          useFactory: () => ({}),
        },
      ],
    }).compile();

    diaryService = module.get<DiaryService>(DiaryService);
    diaryRepository = module.get(DiaryRepository);
    diaryImageRepository = module.get(DiaryImageRepository);
  });

  it('일기장 이미지 삭제 성공', async () => {
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
    const mockDiaryImage: DiaryImageEntity = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      diaryId: 1,
      imageUrl: 'imageUrl',
    };
    diaryRepository.findByUnique.mockResolvedValue(mockDiary);
    diaryImageRepository.findByUnique.mockResolvedValue(mockDiaryImage);

    const result = await diaryService.deleteDiaryImage({
      diaryId: 1,
      diaryImageId: 1,
      userId: 1,
    });

    expect(result).toBeUndefined();
    expect(diaryRepository.findByUnique).toHaveBeenCalledTimes(1);
    expect(diaryImageRepository.findByUnique).toHaveBeenCalledTimes(1);
    expect(diaryImageRepository.delete).toHaveBeenCalledTimes(1);
  });

  it('없는 일기장일 경우 NotFoundDiaryException 을 호출한다', async () => {
    diaryRepository.findByUnique.mockResolvedValue(null);

    await expect(async () => {
      await diaryService.deleteDiaryImage({
        diaryId: 1,
        diaryImageId: 1,
        userId: 1,
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
      await diaryService.deleteDiaryImage({
        diaryId: 1,
        diaryImageId: 1,
        userId: 1,
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
      await diaryService.deleteDiaryImage({
        diaryId: 1,
        diaryImageId: 1,
        userId: 1,
      });
    }).rejects.toThrow(new NotUserDiaryException());
  });

  it('없는 일기장 이미지일 경우 NotFoundDiaryImageException 을 호출한다', async () => {
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
    diaryImageRepository.findByUnique.mockResolvedValue(null);

    await expect(async () => {
      await diaryService.deleteDiaryImage({
        diaryId: 1,
        diaryImageId: 1,
        userId: 1,
      });
    }).rejects.toThrow(new NotFoundDiaryImageException());
  });

  it('일기장의 id 와 일치하지 않는다면 NotDiaryImageException 을 호출한다', async () => {
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
    const mockDiaryImage: DiaryImageEntity = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      diaryId: 2,
      imageUrl: 'imageUrl',
    };
    diaryRepository.findByUnique.mockResolvedValue(mockDiary);
    diaryImageRepository.findByUnique.mockResolvedValue(mockDiaryImage);

    await expect(async () => {
      await diaryService.deleteDiaryImage({
        diaryId: 1,
        diaryImageId: 1,
        userId: 1,
      });
    }).rejects.toThrow(new NotDiaryImageException());
  });
});
