import { Test, TestingModule } from '@nestjs/testing';

import { UploadFileService } from '@app/upload-file';
import { Mock, WithTotal } from '@app/shared/type';
import { DAILY_MAX_CREATE_COUNT } from '@api/shared/constant';

import { DiaryService, DiaryServiceImpl } from '../service';
import { DiaryImageRepository, DiaryRepository } from '../repository';
import {
  MaxDiaryCreateCountException,
  NotDiaryImageException,
  NotFoundDiaryException,
  NotFoundDiaryImageException,
  NotUserDiaryException,
} from '../exception';
import { DiaryIncludeImageAndLike } from '../type';
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

  it('should be defined', () => {
    expect(diaryService).toBeDefined();
  });

  describe('create diary', () => {
    it('?????? ?????? ????????? ???????????? ?????? 403 exception ??? ????????????', async () => {
      diaryRepository.findCount.mockResolvedValue(DAILY_MAX_CREATE_COUNT);

      await expect(async () => {
        await diaryService.createDiary(
          { title: 'test', content: 'test', isOpen: true },
          1,
        );
      }).rejects.toThrow(
        new MaxDiaryCreateCountException(DAILY_MAX_CREATE_COUNT),
      );
    });

    it('????????? ????????? ????????? ?????? ???????????? ???????????? ?????????', async () => {
      await diaryService.createDiary(
        { title: 'test', content: 'test', isOpen: true },
        1,
      );

      expect(uploadFileService.getUploadedImageUrlList).toHaveBeenCalledTimes(
        0,
      );
    });

    it('?????? ?????? ??????', async () => {
      uploadFileService.getUploadedImageUrlList.mockResolvedValue(['imageUrl']);

      const result = await diaryService.createDiary(
        { title: 'test', content: 'test', isOpen: true },
        1,
        [{}] as Express.Multer.File[],
      );

      expect(result).toBe(undefined);
      expect(diaryRepository.findCount).toHaveBeenCalledTimes(1);
      expect(diaryRepository.create).toHaveBeenCalledTimes(1);
      expect(uploadFileService.getUploadedImageUrlList).toHaveBeenCalledTimes(
        1,
      );
    });
  });

  describe('get diary list', () => {
    it('???????????? ????????? ?????? ??????', async () => {
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

  describe('getOpenDiary', () => {
    it('?????? ????????? ??????', async () => {
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

    it('????????? ???????????? ?????? ?????? NotFoundDiaryException ??? ????????????', async () => {
      const mockDiary = {
        status: true,
        isOpen: false,
      };

      diaryRepository.findByUnique.mockResolvedValue(mockDiary);

      await expect(async () => {
        await diaryService.validateOpenDiary(1);
      }).rejects.toThrow(new NotFoundDiaryException());
    });

    it('status ??? false ??? ?????? NotFoundDiaryException ??? ????????????', async () => {
      const mockDiary = {
        status: false,
        isOpen: true,
      };
      diaryRepository.findByUnique.mockResolvedValue(mockDiary);

      await expect(async () => {
        await diaryService.validateOpenDiary(1);
      }).rejects.toThrow(new NotFoundDiaryException());
    });

    it('???????????? ?????? ???????????? ?????? NotFoundDiaryException ??? ????????????', async () => {
      diaryRepository.findByUnique.mockResolvedValue(null);

      await expect(async () => {
        await diaryService.validateOpenDiary(1);
      }).rejects.toThrow(new NotFoundDiaryException());
    });
  });

  describe('getDiary', () => {
    it('?????? ?????? ?????? ??????', async () => {
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

    it('????????? ???????????? ?????? ?????? NotFoundDiaryException ??? ????????????', async () => {
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

    it('status ??? false ??? ?????? NotFoundDiaryException ??? ????????????', async () => {
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

    it('???????????? ?????? ???????????? ?????? NotFoundDiaryException ??? ????????????', async () => {
      diaryRepository.findIncludeLikeAndImage.mockResolvedValue(null);

      await expect(async () => {
        await diaryService.getDiary({
          diaryId: 1,
        });
      }).rejects.toThrow(new NotFoundDiaryException());
    });
  });

  describe('getMyDiaryList', () => {
    it('??? ????????? ????????? ?????? ??????', async () => {
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

  describe('updateDiary', () => {
    it('????????? ???????????? ??????', async () => {
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

    it('?????? ???????????? ?????? NotFoundDiaryException ??? ????????????', async () => {
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

    it('????????? status ??? false ??? ?????? NotFoundDiaryException ??? ????????????', async () => {
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

    it('????????? ???????????? ?????? ?????? NotUserDiaryException ??? ????????????', async () => {
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
    it('????????? ????????? ?????? ??????', async () => {
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

    it('?????? ???????????? ?????? NotFoundDiaryException ??? ????????????', async () => {
      diaryRepository.findByUnique.mockResolvedValue(null);

      await expect(async () => {
        await diaryService.createDiaryImage(
          { diaryId: 1 },
          {} as Express.Multer.File,
          1,
        );
      }).rejects.toThrow(new NotFoundDiaryException());
    });

    it('????????? status ??? false ??? ?????? NotFoundDiaryException ??? ????????????', async () => {
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

    it('????????? ???????????? ?????? ?????? NotUserDiaryException ??? ????????????', async () => {
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
    it('????????? ????????? ?????? ??????', async () => {
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

    it('?????? ???????????? ?????? NotFoundDiaryException ??? ????????????', async () => {
      diaryRepository.findByUnique.mockResolvedValue(null);

      await expect(async () => {
        await diaryService.deleteDiaryImage({
          diaryId: 1,
          diaryImageId: 1,
          userId: 1,
        });
      }).rejects.toThrow(new NotFoundDiaryException());
    });

    it('????????? status ??? false ??? ?????? NotFoundDiaryException ??? ????????????', async () => {
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

    it('????????? ???????????? ?????? ?????? NotUserDiaryException ??? ????????????', async () => {
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

    it('?????? ????????? ???????????? ?????? NotFoundDiaryImageException ??? ????????????', async () => {
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

    it('???????????? id ??? ???????????? ???????????? NotDiaryImageException ??? ????????????', async () => {
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
    it('diary ??? ?????? ?????? NotFoundDiaryException ??? ????????????', async () => {
      diaryRepository.findByUnique.mockResolvedValue(null);

      await expect(async () => {
        await diaryService.validateExistDiary(1);
      }).rejects.toThrow(new NotFoundDiaryException());
    });
    it('diary status ??? false ??? ?????? NotFoundDiaryException ??? ????????????', async () => {
      diaryRepository.findByUnique.mockResolvedValue({ status: false });

      await expect(async () => {
        await diaryService.validateExistDiary(1);
      }).rejects.toThrow(new NotFoundDiaryException());
    });
  });
});
