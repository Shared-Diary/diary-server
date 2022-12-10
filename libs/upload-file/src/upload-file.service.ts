export abstract class UploadFileService {
  abstract getUploadedImageUrlList(
    files: Express.Multer.File[],
  ): Promise<string[]>;

  abstract getUploadedImageUrl(file: Express.Multer.File): Promise<string>;
}
