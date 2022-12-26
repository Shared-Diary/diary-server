import { Test, TestingModule } from '@nestjs/testing';

import { UploadFileService } from '@app/upload-file';
import { Mock, WithTotal } from '@app/shared/type';
import { DAILY_MAX_CREATE_COUNT } from '@api/shared/constant';

import { DiaryService, DiaryServiceImpl } from '../service';
import { DiaryImageRepository, DiaryRepository } from '../repository';
import {
  MaxDiaryCreateCountException,
  NotFoundDiaryException,
  NotUserDiaryException,
} from '../exception';
import { DiaryIncludeImageAndLikeType } from '../type';
import { GetMyDiaryListResponseDto } from '../dto/responses';
import { DiaryEntity } from '../entity';

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
            findCountBetweenDatesByUser: jest.fn(),
            create: jest.fn(),
            findListIncludeLikeAndImage: jest.fn(),
            findIncludeLikeAndImage: jest.fn(),
            findByUserIncludeLikeAndImage: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
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
    it('하루 최대 개수를 초과했을 경우 403 exception 을 반환한다', async () => {
      diaryRepository.findCountBetweenDatesByUser.mockResolvedValue(
        DAILY_MAX_CREATE_COUNT,
      );

      await expect(async () => {
        await diaryService.createDiary(
          { title: 'test', content: 'test', isOpen: true },
          1,
        );
      }).rejects.toThrow(
        new MaxDiaryCreateCountException(DAILY_MAX_CREATE_COUNT),
      );
    });

    it('이미지 파일이 없다면 파일 업로드를 수행하지 않는다', async () => {
      await diaryService.createDiary(
        { title: 'test', content: 'test', isOpen: true },
        1,
      );

      expect(uploadFileService.getUploadedImageUrlList).toHaveBeenCalledTimes(
        0,
      );
    });

    it('일기 생성 성공', async () => {
      uploadFileService.getUploadedImageUrlList.mockResolvedValue(['imageUrl']);

      const result = await diaryService.createDiary(
        { title: 'test', content: 'test', isOpen: true },
        1,
        [{}] as Express.Multer.File[],
      );

      expect(result).toBe(undefined);
      expect(diaryRepository.findCountBetweenDatesByUser).toHaveBeenCalledTimes(
        1,
      );
      expect(diaryRepository.create).toHaveBeenCalledTimes(1);
      expect(uploadFileService.getUploadedImageUrlList).toHaveBeenCalledTimes(
        1,
      );
    });
  });

  describe('get diary list', () => {
    it('다이어리 리스트 조회 성공', async () => {
      const mockData: WithTotal<DiaryIncludeImageAndLikeType[]> = [
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
      diaryRepository.findById.mockResolvedValue(mockDiary);

      const result = await diaryService.validateOpenDiary(1);

      expect(diaryRepository.findById).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it('공개된 일기장이 아닐 경우 NotFoundDiaryException 을 반환한다', async () => {
      const mockDiary = {
        status: true,
        isOpen: false,
      };

      diaryRepository.findById.mockResolvedValue(mockDiary);

      await expect(async () => {
        await diaryService.validateOpenDiary(1);
      }).rejects.toThrow(new NotFoundDiaryException());
    });

    it('status 가 false 일 경우 NotFoundDiaryException 을 반환한다', async () => {
      const mockDiary = {
        status: false,
        isOpen: true,
      };
      diaryRepository.findById.mockResolvedValue(mockDiary);

      await expect(async () => {
        await diaryService.validateOpenDiary(1);
      }).rejects.toThrow(new NotFoundDiaryException());
    });

    it('존재하지 않는 일기장일 경우 NotFoundDiaryException 을 반환한다', async () => {
      diaryRepository.findById.mockResolvedValue(null);

      await expect(async () => {
        await diaryService.validateOpenDiary(1);
      }).rejects.toThrow(new NotFoundDiaryException());
    });
  });

  describe('getDiary', () => {
    it('일기 상세 조회 성공', async () => {
      const mockDiary: DiaryIncludeImageAndLikeType = {
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

  describe('getMyDiaryList', () => {
    it('내 일기장 리스트 조회 성공', async () => {
      const mockData: WithTotal<DiaryIncludeImageAndLikeType[]> = [
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
      await diaryRepository.findByUserIncludeLikeAndImage.mockResolvedValue(
        mockData,
      );

      const [diaries, total] = await diaryService.getMyDiaryList({
        userId: 1,
        page: 1,
        pageSize: 10,
      });

      expect(total).toBe(1);
      expect(
        diaryRepository.findByUserIncludeLikeAndImage,
      ).toHaveBeenCalledTimes(1);
    });
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
      diaryRepository.findById.mockResolvedValue(mockDiary);

      const result = await diaryService.updateDiary({
        userId: 1,
        bodyDto: {
          title: 'new title',
          content: 'new content',
          isOpen: false,
        },
        paramDto: {
          diaryId: 1,
        },
      });

      expect(result).toBeUndefined();
      expect(diaryRepository.update).toHaveBeenCalledTimes(1);
    });

    it('없는 일기장일 경우 NotFoundDiaryException 을 호출한다', async () => {
      diaryRepository.findById.mockResolvedValue(null);

      await expect(async () => {
        await diaryService.updateDiary({
          userId: 1,
          bodyDto: {
            title: 'new title',
            content: 'new content',
            isOpen: false,
          },
          paramDto: {
            diaryId: 2,
          },
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
      diaryRepository.findById.mockResolvedValue(mockDiary);

      await expect(async () => {
        await diaryService.updateDiary({
          userId: 1,
          bodyDto: {
            title: 'new title',
            content: 'new content',
            isOpen: false,
          },
          paramDto: {
            diaryId: 2,
          },
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
      diaryRepository.findById.mockResolvedValue(mockDiary);

      await expect(async () => {
        await diaryService.updateDiary({
          userId: 1,
          bodyDto: {
            title: 'new title',
            content: 'new content',
            isOpen: false,
          },
          paramDto: {
            diaryId: 2,
          },
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
      diaryRepository.findById.mockResolvedValue(mockDiary);

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
      diaryRepository.findById.mockResolvedValue(null);

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
      diaryRepository.findById.mockResolvedValue(mockDiary);

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
      diaryRepository.findById.mockResolvedValue(mockDiary);

      await expect(async () => {
        await diaryService.createDiaryImage(
          { diaryId: 1 },
          {} as Express.Multer.File,
          1,
        );
      }).rejects.toThrow(new NotUserDiaryException());
    });
  });
});
