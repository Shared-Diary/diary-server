import { Test, TestingModule } from '@nestjs/testing';

import { UploadFileService } from '@app/upload-file';

import { Mock } from '@app/shared/type';
import { DAILY_MAX_CREATE_COUNT } from '@api/shared/constant';
import { DiaryService, DiaryServiceImpl } from '../service';
import { DiaryRepository } from '../repository';
import { MaxDiaryCreateCountException } from '../exception';

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
});
