import { AuthService } from './auth.service';
import { RegisterRequestDto } from '../dto';

export class AuthServiceImpl implements AuthService {
  async register({ email, password }: RegisterRequestDto): Promise<void> {
    console.log('');
  }
}
