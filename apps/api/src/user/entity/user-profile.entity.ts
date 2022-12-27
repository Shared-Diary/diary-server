import { UserProfile } from '@prisma/client';

export class UserProfileEntity implements UserProfile {
  id: number;

  createdAt: Date;

  updatedAt: Date;

  userId: number;

  profileUrl: string | null;

  nickName: string;

  introduce: string;
}
