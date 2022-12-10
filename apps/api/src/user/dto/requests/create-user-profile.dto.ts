import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import {
  MAX_PROFILE_INTRODUCE_LENGTH,
  MAX_PROFILE_NICKNAME_LENGTH,
  MIN_PROFILE_INTRODUCE_LENGTH,
  MIN_PROFILE_NICKNAME_LENGTH,
} from '@api/shared/constant';

export class CreateUserProfileDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(MIN_PROFILE_NICKNAME_LENGTH)
  @MaxLength(MAX_PROFILE_NICKNAME_LENGTH)
  readonly nickName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(MIN_PROFILE_INTRODUCE_LENGTH)
  @MaxLength(MAX_PROFILE_INTRODUCE_LENGTH)
  readonly introduce: string;
}

export class CreateUserProfileDtoForSwagger extends CreateUserProfileDto {
  @ApiProperty({ type: 'file' })
  profileImageFile: Express.Multer.File;
}
