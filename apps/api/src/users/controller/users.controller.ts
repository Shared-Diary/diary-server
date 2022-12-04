import { Param, ParseIntPipe } from '@nestjs/common';

import {
  UsersController as Controller,
  GetUserProfile,
  CreateUserProfile,
} from './users.controller.decorator';
import { UserService } from '../service';
import { GetUserProfileResponseDto } from '../dto';

@Controller()
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @GetUserProfile()
  async getUserProfile(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<GetUserProfileResponseDto> {
    const userProfile = await this.userService.findUserWithProfile(userId);

    return userProfile;
  }

  @CreateUserProfile()
  async createUserProfile(): Promise<null> {
    return null;
  }
}
