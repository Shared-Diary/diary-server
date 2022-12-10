import {
  Body,
  Param,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FileInterceptor('profileImageFile'))
  async createUserProfile(
    @Body() dto: CreateUserProfileDto,
    @UploadedFile() profileImageFile: Express.Multer.File,
  ): Promise<null> {
    await this.usersService.createUserProfile(dto, profileImageFile);

    return null;
  }
}
