import { Test, TestingModule } from '@nestjs/testing';

import { UploadFileService } from '@app/upload-file';

import { Mock } from '@app/shared/type';
import { DAILY_MAX_CREATE_COUNT } from '@api/shared/constant';
import { DiaryService, DiaryServiceImpl } from '../service';
import { DiaryRepository } from '../repository';
import { MaxDiaryCreateCountException } from '../exception';
import { DiaryIncludeImagesAndLikeCount } from '../dto';
import { GetDiaryListIncludeImageAndLikeType } from '../type';

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
            getCountBetweenDatesByUser: jest.fn(),
            create: jest.fn(),
            getListIncludeLikeAndImage: jest.fn(),
          }),
        },
        {
          provide: UploadFileService,
          useFactory: () => ({
            getUploadedImageList: jest.fn(),
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
      diaryRepository.getCountBetweenDatesByUser.mockResolvedValue(
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

      expect(uploadFileService.getUploadedImageList).toHaveBeenCalledTimes(0);
    });

    it('다이어리 생성 성공', async () => {
      uploadFileService.getUploadedImageList.mockResolvedValue(['imageUrl']);

      const result = await diaryService.createDiary(
        { title: 'test', content: 'test', isOpen: true },
        1,
        [{}] as Express.Multer.File[],
      );

      expect(result).toBe(undefined);
      expect(diaryRepository.getCountBetweenDatesByUser).toHaveBeenCalledTimes(
        1,
      );
      expect(diaryRepository.create).toHaveBeenCalledTimes(1);
      expect(uploadFileService.getUploadedImageList).toHaveBeenCalledTimes(1);
    });
  });

  describe('get diary list', () => {
    it('다이어리 리스트 조회 성공', async () => {
      const mockData: GetDiaryListIncludeImageAndLikeType[] = [
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
      ];
      diaryRepository.getListIncludeLikeAndImage.mockResolvedValue(mockData);

      const result = await diaryService.getDiaryList({ page: 1, pageSize: 10 });
      expect(Array.isArray(result)).toBe(true);
      expect(diaryRepository.getListIncludeLikeAndImage).toHaveBeenCalledTimes(
        1,
      );
      expect(result[0].diaryLikeCount).toBe(0);
    });

    it('리스트가 빈 배열일 경우 null 을 return 한다', async () => {
      diaryRepository.getListIncludeLikeAndImage.mockResolvedValue([]);

      const result = await diaryService.getDiaryList({ page: 1, pageSize: 10 });
      expect(result).toBe(null);
    });
  });
});
