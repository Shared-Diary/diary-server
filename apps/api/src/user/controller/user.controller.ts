import { Body, Param, ParseIntPipe, UploadedFile } from '@nestjs/common';

import { FileRequest, Jwt } from '@app/utils/decorators';
import { JwtRequestDto } from '@api/shared/dto';

import {
  UserController as Controller,
  GetUserProfile,
  CreateUserProfile,
} from './user.controller.decorator';
import { UserService } from '../service';
import { GetUserProfileResponseDto } from '../dto/responses';
import { CreateUserProfileDto } from '../dto/requests';

@Controller()
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @GetUserProfile()
  async getUserProfile(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<GetUserProfileResponseDto> {
    const userProfile = await this.usersService.findUserWithProfile(userId);

    return userProfile;
  }

  @CreateUserProfile()
  @FileRequest('profileImageFile')
  async createUserProfile(
    @Jwt() { userId }: JwtRequestDto,
    @Body() dto: CreateUserProfileDto,
    @UploadedFile() profileImageFile?: Express.Multer.File,
  ): Promise<null> {
    await this.usersService.createUserProfile(dto, userId, profileImageFile);

    return null;
  }
}
