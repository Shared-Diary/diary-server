import { GetMyDiaryResponseDto } from './get-my-diary-response.dto';
import { DiaryIncludeImageAndLike } from '../../type';

export class GetDiaryListResponseDto {
  readonly diaries: GetMyDiaryResponseDto[];

  readonly total: number;

  constructor(
    diaryIncludeImageAndLike: DiaryIncludeImageAndLike[],
    total: number,
  ) {
    this.diaries = diaryIncludeImageAndLike.map(
      (diary) => new GetMyDiaryResponseDto(diary),
    );
    this.total = total;
  }
}
