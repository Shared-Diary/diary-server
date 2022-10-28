import { Injectable } from '@nestjs/common';

import { UsersService } from './users.service';

@Injectable()
export class UsersServiceImpl implements UsersService {
  async validateIsExistEmail(email: string): Promise<void> {
    console.log('1');
  }
}
