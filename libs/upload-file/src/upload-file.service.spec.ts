import { Test, TestingModule } from '@nestjs/testing';

import { AwsS3ConfigProvider } from '@app/aws';
import { Mock } from '@app/shared/type';

import { UploadFileService } from './upload-file.service';
import { AwsS3UploadFileService } from './aws-s3-upload-file.service';

describe('UploadFileService', () => {
  let uploadFileService: UploadFileService;
  let s3Provider: Mock<AwsS3ConfigProvider>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UploadFileService,
          useClass: AwsS3UploadFileService,
        },
        {
          provide: AwsS3ConfigProvider,
          useFactory: () => ({
            getS3: jest.fn(),
            getBucketName: jest.fn(),
          }),
        },
      ],
    }).compile();

    uploadFileService = module.get<UploadFileService>(UploadFileService);
    s3Provider = module.get(AwsS3ConfigProvider);
  });

  it('should be defined', () => {
    expect(uploadFileService).toBeDefined();
  });
});
