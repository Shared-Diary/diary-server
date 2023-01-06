import { DiaryEntity, DiaryImageEntity, DiaryLikeEntity } from '../entity';
import { UpdateDiaryRequestDto } from '../dto/requests';
import { UserWithProfile } from '../../user/type';

export type DiaryIncludeImageAndLike = DiaryEntity & {
  diaryImage: DiaryImageEntity[];
  diaryLike: DiaryLikeEntity[];
};

export type DiaryLikeWithUserProfile = DiaryLikeEntity & {
  user: UserWithProfile;
};

export type GetMyDiaryOptions = {
  userId: number;
  page: number;
  pageSize: number;
};

export type UpdateDiaryOptions = {
  userId: number;
  diaryId: number;
  bodyDto: UpdateDiaryRequestDto;
};

export type DeleteDiaryImageOptions = {
  userId: number;
  diaryId: number;
  diaryImageId: number;
};

export type GetDiaryLikeUserListOptions = {
  diaryId: number;
  page: number;
  pageSize: number;
};
