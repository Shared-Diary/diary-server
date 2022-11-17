import { Module } from '@nestjs/common';

import { AwsModule } from '@app/aws';

import { UploadFileService } from './upload-file.service';
import { AwsS3UploadFileService } from './aws-s3-upload-file.service';

@Module({
  imports: [AwsModule],
  providers: [
    {
      provide: UploadFileService,
      useClass: AwsS3UploadFileService,
    },
  ],
  exports: [UploadFileService],
})
export class UploadFileModule {}
