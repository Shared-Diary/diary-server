import { Test, TestingModule } from '@nestjs/testing';

import { UploadFileService } from '@app/upload-file';
import { Mock, WithTotal } from '@app/shared/type';
import { DAILY_MAX_CREATE_COUNT } from '@api/shared/constant';

import { DiaryService, DiaryServiceImpl } from '../service';
import { DiaryRepository } from '../repository';
import {
  MaxDiaryCreateCountException,
  NotFoundDiaryException,
} from '../exception';
import { DiaryIncludeImageAndLikeType } from '../type';
import { GetMyDiaryListResponseDto } from '../dto/responses';

describe('DiaryService', () => {
  let diaryService: DiaryService;
  let diaryRepository: Mock<DiaryRepository>;
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
          }),
        },
        {
          provide: UploadFileService,
          useFactory: () => ({
            getUploadedImageUrlList: jest.fn(),
          }),
        },
      ],
    }).compile();

    diaryService = module.get<DiaryService>(DiaryService);
    diaryRepository = module.get(DiaryRepository);
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

    it('다이어리 생성 성공', async () => {
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

      const { diaries, total } = await diaryService.getDiaryList({
        page: 1,
        pageSize: 10,
      });
      expect(Array.isArray(diaries)).toBe(true);
      expect(diaryRepository.findListIncludeLikeAndImage).toHaveBeenCalledTimes(
        1,
      );
      expect(diaries[0].likeCount).toBe(0);
      expect(total).toBe(1);
    });

    it('리스트가 빈 배열일 경우 null 을 return 한다', async () => {
      diaryRepository.findListIncludeLikeAndImage.mockResolvedValue([]);

      const { diaries } = await diaryService.getDiaryList({
        page: 1,
        pageSize: 10,
      });
      expect(diaries).toBe(null);
    });
  });

  describe('getDiary', () => {
    it('다이어리 상세 조회 성공', async () => {
      const mockData: DiaryIncludeImageAndLikeType = {
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
      diaryRepository.findIncludeLikeAndImage.mockResolvedValue(mockData);

      const { diary, images, likeCount } = await diaryService.getDiary({
        diaryId: 1,
      });

      expect(diaryRepository.findIncludeLikeAndImage).toHaveBeenCalledTimes(1);
      expect(diary.status).toBe(true);
      expect(diary.isOpen).toBe(true);
      expect(likeCount).toBe(0);
      expect(images).toStrictEqual([]);
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
    it('내 다이어리 리스트 조회 성공', async () => {
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

      const result = await diaryService.getMyDiaryList({
        userId: 1,
        page: 1,
        pageSize: 10,
      });

      expect(result).toBeInstanceOf(GetMyDiaryListResponseDto);
      expect(result.total).toBe(1);
    });
  });
});
