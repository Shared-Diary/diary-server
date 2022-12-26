import { GetDiaryImageResponseDto } from './get-diary-image-response.dto';
import { DiaryIncludeImageAndLikeType } from '../../type';

export class GetDiaryResponseDto {
  readonly id: number;

  readonly createdAt: string;

  readonly updatedAt: string;

  readonly title: string;

  readonly isOpen: boolean;

  readonly images: GetDiaryImageResponseDto[];

  readonly likeCount: number;

  constructor(diaryIncludeImageAndLike: DiaryIncludeImageAndLikeType) {
    const { id, createdAt, updatedAt, title, isOpen, diaryImage, diaryLike } =
      diaryIncludeImageAndLike;

    this.id = id;
    this.createdAt = createdAt.toISOString();
    this.updatedAt = updatedAt.toISOString();
    this.title = title;
    this.isOpen = isOpen;
    this.images = diaryImage.map(
      (image) => new GetDiaryImageResponseDto(image),
    );
    this.likeCount = diaryLike.length;
  }
}
