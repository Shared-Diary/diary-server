export abstract class UploadFileService {
  abstract getUploadedImageList(
    files: Express.Multer.File[],
  ): Promise<string[]>;

  abstract getUploadedImage(file: Express.Multer.File): Promise<string>;
}
