import { DiaryIncludeImageAndLikeType } from '../../type';
import { GetMyDiaryResponseDto } from './get-my-diary-response.dto';

export class GetMyDiaryListResponseDto {
  readonly diaries: GetMyDiaryResponseDto[];

  readonly total: number;

  constructor(
    diaryIncludeImageAndLike: DiaryIncludeImageAndLikeType[],
    total: number,
  ) {
    this.diaries = diaryIncludeImageAndLike.map(
      (diary) => new GetMyDiaryResponseDto(diary),
    );
    this.total = total;
  }
}
