import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PasswordEncoderService } from '@app/password-encoder';

import { UsersService } from './users.service';
import { UsersRepository } from '../repository';
import { DuplicateEmailException } from '../exception';

@Injectable()
export class UsersServiceImpl implements UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordEncoderService: PasswordEncoderService,
  ) {}

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

    const hashedPassword = await this.passwordEncoderService.encode(password);
    try {
      await this.usersRepository.create({
        email,
        password: hashedPassword,
      });
    } catch (error) {
      throw new InternalServerErrorException({ message: error });
    }
  }
}
