import { Param, ParseIntPipe } from '@nestjs/common';

import {
  UsersController as Controller,
  GetUserProfile,
} from './users.controller.decorator';
import { UsersService } from '../service';
import { GetUserProfileResponseDto } from '../dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @GetUserProfile()
  async getUserProfile(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<GetUserProfileResponseDto> {
    const userProfile = await this.usersService.findUserWithProfile(userId);

    return userProfile;
  }
}
