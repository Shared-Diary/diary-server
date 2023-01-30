import { Test, TestingModule } from '@nestjs/testing';

import { Mock } from '@app/shared/type';
import { UploadFileService } from '@app/upload-file';
import { DAILY_MAX_CREATE_COUNT } from '@api/shared/constant';

import { DiaryImageRepository, DiaryRepository } from '../../../repository';
import { DiaryService, DiaryServiceImpl } from '../../../service';
import { MaxDiaryCreateCountException } from '../../../exception';

describe('다이어리 생성', () => {
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
            findCount: jest.fn(),
            create: jest.fn(),
          }),
        },
        {
          provide: DiaryImageRepository,
          useFactory: () => ({}),
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
    uploadFileService = module.get(UploadFileService);
  });

  it('하루 최대 개수를 초과했을 경우 403 exception 을 반환한다', async () => {
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

  it('이미지 파일이 없다면 파일 업로드를 수행하지 않는다', async () => {
    await diaryService.createDiary(
      { title: 'test', content: 'test', isOpen: true },
      1,
    );

    expect(uploadFileService.getUploadedImageUrlList).toHaveBeenCalledTimes(0);
  });

  it('일기 생성 성공', async () => {
    uploadFileService.getUploadedImageUrlList.mockResolvedValue(['imageUrl']);

    const result = await diaryService.createDiary(
      { title: 'test', content: 'test', isOpen: true },
      1,
      [{}] as Express.Multer.File[],
    );

    expect(result).toBe(undefined);
    expect(diaryRepository.findCount).toHaveBeenCalledTimes(1);
    expect(diaryRepository.create).toHaveBeenCalledTimes(1);
    expect(uploadFileService.getUploadedImageUrlList).toHaveBeenCalledTimes(1);
  });
});
