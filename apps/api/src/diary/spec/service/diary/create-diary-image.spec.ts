import { Test, TestingModule } from '@nestjs/testing';

import { Mock } from '@app/shared/type';
import { UploadFileService } from '@app/upload-file';

import { DiaryImageRepository, DiaryRepository } from '../../../repository';
import { DiaryService, DiaryServiceImpl } from '../../../service';
import { DiaryEntity } from '../../../entity';
import {
  NotFoundDiaryException,
  NotUserDiaryException,
} from '../../../exception';

describe('일기 이미지 생성', () => {
  let diaryService: DiaryService;
  let diaryRepository: Mock<DiaryRepository>;
  let diaryImageRepository: Mock<DiaryImageRepository>;
  let uploadFileService: Mock<UploadFileService>;

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
            create: jest.fn(),
          }),
        },
        {
          provide: UploadFileService,
          useFactory: () => ({
            getUploadedImageUrl: jest.fn(),
          }),
        },
      ],
    }).compile();

    diaryService = module.get<DiaryService>(DiaryService);
    diaryRepository = module.get(DiaryRepository);
    diaryImageRepository = module.get(DiaryImageRepository);
    uploadFileService = module.get(UploadFileService);
  });

  it('일기장 이미지 생성 성공', async () => {
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

    const result = await diaryService.createDiaryImage(
      { diaryId: 1 },
      {} as Express.Multer.File,
      1,
    );

    expect(result).toBeUndefined();
    expect(uploadFileService.getUploadedImageUrl).toHaveBeenCalledTimes(1);
    expect(diaryImageRepository.create).toHaveBeenCalledTimes(1);
  });

  it('없는 일기장일 경우 NotFoundDiaryException 을 호출한다', async () => {
    diaryRepository.findByUnique.mockResolvedValue(null);

    await expect(async () => {
      await diaryService.createDiaryImage(
        { diaryId: 1 },
        {} as Express.Multer.File,
        1,
      );
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
      await diaryService.createDiaryImage(
        { diaryId: 1 },
        {} as Express.Multer.File,
        1,
      );
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
      await diaryService.createDiaryImage(
        { diaryId: 1 },
        {} as Express.Multer.File,
        1,
      );
    }).rejects.toThrow(new NotUserDiaryException());
  });
});
