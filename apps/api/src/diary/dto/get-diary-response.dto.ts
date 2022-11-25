import { DiaryEntity, DiaryImageEntity } from '../entity';

export class GetDiaryResponseDto {
  readonly diary: DiaryEntity;

  readonly images: DiaryImageEntity[];

  readonly likeCount: number;

  constructor(partial: Partial<GetDiaryResponseDto>) {
    Object.assign(this, partial);
  }
}
