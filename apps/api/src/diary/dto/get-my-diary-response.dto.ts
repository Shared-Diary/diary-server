import { GetMyDiaryImageResponseDto } from './get-my-diary-image-response.dto';
import { DiaryIncludeImageAndLikeType } from '../type';

export class GetMyDiaryResponseDto {
  readonly id: number;

  readonly createdAt: string;

  readonly updatedAt: string;

  readonly title: string;

  readonly isOpen: boolean;

  readonly images: GetMyDiaryImageResponseDto[];

  readonly likeCount: number;

  constructor(diaryIncludeImageAndLikeType: DiaryIncludeImageAndLikeType) {
    const { id, createdAt, updatedAt, title, isOpen, diaryImage, diaryLike } =
      diaryIncludeImageAndLikeType;

    this.id = id;
    this.createdAt = createdAt.toISOString();
    this.updatedAt = updatedAt.toISOString();
    this.title = title;
    this.isOpen = isOpen;
    this.images = diaryImage.map(
      (image) => new GetMyDiaryImageResponseDto(image),
    );
    this.likeCount = diaryLike.length;
  }
}
