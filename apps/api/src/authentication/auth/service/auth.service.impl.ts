import { Injectable } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterRequestDto } from '../dto';
import { UsersService } from '../../../users/service';

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register({ email, password }: RegisterRequestDto): Promise<void> {
    await this.usersService.createUser({ email, password });
  }
}
