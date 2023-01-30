import { Test, TestingModule } from '@nestjs/testing';

import { UploadFileService } from '@app/upload-file';
import { Mock } from '@app/shared/type';

import { DiaryService, DiaryServiceImpl } from '../../../service';
import { DiaryImageRepository, DiaryRepository } from '../../../repository';
import { NotFoundDiaryException } from '../../../exception';

describe('DiaryService', () => {
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
