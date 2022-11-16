import { Test, TestingModule } from '@nestjs/testing';
import { AwsS3ConfigProvider } from './aws-s3-config.provider';

describe('AwsService', () => {
  let service: AwsS3ConfigProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwsS3ConfigProvider],
    }).compile();

    service = module.get<AwsS3ConfigProvider>(AwsS3ConfigProvider);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
