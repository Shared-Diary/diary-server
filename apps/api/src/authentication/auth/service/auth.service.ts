import { RegisterRequestDto } from '../dto';

export abstract class AuthService {
  abstract register(dto: RegisterRequestDto): Promise<void>;
}
