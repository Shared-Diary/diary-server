export interface UploadS3Type {
  file: Buffer;
  bucket: string;
  name: string;
  mimetype: string;
}

export interface UploadFileType {
  ETag: string;
  Location: string;
  key: string;
  Key: string;
  Bucket: string;
}
