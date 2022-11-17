export abstract class UploadFileService {
  abstract getUploadedImage(file: Express.Multer.File): Promise<string>;
}
