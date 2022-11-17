import { Module } from '@nestjs/common';
import { AwsS3ConfigProvider } from './aws-s3-config.provider';

@Module({
  providers: [AwsS3ConfigProvider],
  exports: [AwsS3ConfigProvider],
})
export class AwsModule {}
