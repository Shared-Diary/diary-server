import { Body, Param, ParseIntPipe } from '@nestjs/common';

import { User } from '@app/utils/decorators';
import { UserRequestDto } from '@api/shared/dto';

import {
  UsersController as Controller,
  GetUserProfile,
  CreateUserProfile,
} from './users.controller.decorator';
import { UserService } from '../service';
import { GetUserProfileResponseDto } from '../dto/responses';
import { CreateUserProfileRequestDto } from '../dto/requests';

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
  async createUserProfile(
    @User() { userId }: UserRequestDto,
    @Body() createUserProfileRequestDto: CreateUserProfileRequestDto,
  ): Promise<null> {
    await this.userService.createUserProfile(
      userId,
      createUserProfileRequestDto,
    );

    return null;
  }
}
