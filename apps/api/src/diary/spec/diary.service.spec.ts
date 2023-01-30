import { Test, TestingModule } from '@nestjs/testing';

import { UploadFileService } from '@app/upload-file';
import { Mock } from '@app/shared/type';

import { DiaryService, DiaryServiceImpl } from '../service';
import { DiaryImageRepository, DiaryRepository } from '../repository';
import {
  NotDiaryImageException,
  NotFoundDiaryException,
  NotFoundDiaryImageException,
  NotUserDiaryException,
} from '../exception';
import { DiaryEntity, DiaryImageEntity } from '../entity';

describe('DiaryService', () => {
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
            findCount: jest.fn(),
            create: jest.fn(),
            findListIncludeLikeAndImage: jest.fn(),
            findIncludeLikeAndImage: jest.fn(),
            update: jest.fn(),
            findByUnique: jest.fn(),
          }),
        },
        {
          provide: DiaryImageRepository,
          useFactory: () => ({
            create: jest.fn(),
            findByUnique: jest.fn(),
            delete: jest.fn(),
          }),
        },
        {
          provide: UploadFileService,
          useFactory: () => ({
            getUploadedImageUrlList: jest.fn(),
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

  describe('updateDiary', () => {
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

  describe('createDiaryImage', () => {
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

  describe('deleteDiaryImage', () => {
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

  describe('validateExistDiary', () => {
    it('diary 가 없는 경우 NotFoundDiaryException 를 호출한다', async () => {
      diaryRepository.findByUnique.mockResolvedValue(null);

      await expect(async () => {
        await diaryService.validateExistDiary(1);
      }).rejects.toThrow(new NotFoundDiaryException());
    });
    it('diary status 가 false 인 경우 NotFoundDiaryException 를 호출한다', async () => {
      diaryRepository.findByUnique.mockResolvedValue({ status: false });

      await expect(async () => {
        await diaryService.validateExistDiary(1);
      }).rejects.toThrow(new NotFoundDiaryException());
    });
  });
});
