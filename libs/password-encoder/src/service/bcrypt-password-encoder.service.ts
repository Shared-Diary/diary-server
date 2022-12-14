import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PasswordEncoderService } from './password-encoder.service';

@Injectable()
export class BcryptPasswordEncoderService implements PasswordEncoderService {
  private readonly SALT_OR_ROUNDS = 10;

  async encode(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.SALT_OR_ROUNDS);

    return bcrypt.hash(password, salt);
  }

  isMatches(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
