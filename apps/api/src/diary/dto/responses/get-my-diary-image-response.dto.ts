import { DiaryImageEntity } from '../../entity';

export class GetMyDiaryImageResponseDto {
  readonly id: number;

  readonly imageUrl: string;

  constructor(diaryImage: DiaryImageEntity) {
    const { id, imageUrl } = diaryImage;

    this.id = id;
    this.imageUrl = imageUrl;
  }
}
