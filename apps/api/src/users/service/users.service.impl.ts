import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { UsersService } from './users.service';
import { UsersRepository } from '../repository';
import { DuplicateEmailException } from '../exception';

@Injectable()
export class UsersServiceImpl implements UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  private async validateIsExistEmail(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);
    if (user) {
      throw new DuplicateEmailException();
    }
  }

  async createUser({
    email,
    password,
  }: Prisma.UsersUncheckedCreateInput): Promise<void> {
    await this.validateIsExistEmail(email);
  }
}
