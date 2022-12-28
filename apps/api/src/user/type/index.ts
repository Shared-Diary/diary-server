import { UserEntity, UserProfileEntity } from '../entity';

export type UserWithProfile = UserEntity & {
  userProfile: UserProfileEntity | null;
};
