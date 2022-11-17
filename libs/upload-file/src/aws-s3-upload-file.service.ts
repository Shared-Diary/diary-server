import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { S3 } from 'aws-sdk';

import { AwsS3ConfigProvider } from '@app/aws';
import { RandomId } from '@app/utils';

import { UploadFileType, UploadS3Type } from '@app/upload-file/type';
import { UploadFileService } from './upload-file.service';

@Injectable()
export class AwsS3UploadFileService implements UploadFileService {
  constructor(private readonly s3Provider: AwsS3ConfigProvider) {}

  async getUploadedImage(file: Express.Multer.File): Promise<string> {
    const { Location: imageUrl } = await this.uploadFile(file);

    return imageUrl;
  }

  private uploadFile(file: Express.Multer.File): Promise<UploadFileType> {
    const { originalname, buffer, mimetype } = file;
    const s3Bucket = this.s3Provider.getBucketName();

    try {
      return this.uploadS3({
        file: buffer,
        mimetype,
        name: `${originalname}/${RandomId.generateId()}`,
        bucket: s3Bucket,
      }) as Promise<UploadFileType>;
    } catch (error) {
      throw new InternalServerErrorException('파일 업로드에 실패했습니다');
    }
  }

  private uploadS3({ file, mimetype, name, bucket }: UploadS3Type) {
    const s3 = this.s3Provider.getS3();
    const s3Params: S3.Types.PutObjectRequest = {
      Bucket: bucket,
      Key: name,
      Body: file,
      ContentType: mimetype,
      ContentDisposition: 'inline',
      ACL: 'public-read',
    };

    return this.uploadFileToS3(s3, s3Params);
  }

  private uploadFileToS3(s3: S3, s3Params: S3.Types.PutObjectRequest) {
    return new Promise((resolve, reject) => {
      s3.upload(s3Params, (err, data) => {
        if (err) {
          Logger.error(err);
          reject(err);
        }
        resolve(data);
      });
    });
  }
}
