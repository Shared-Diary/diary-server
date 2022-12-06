import { Param, ParseIntPipe } from '@nestjs/common';

import {
  UserController as Controller,
  GetUserProfile,
} from './user.controller.decorator';
import { UserService } from '../service';
import { GetUserProfileResponseDto } from '../dto';

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
}
