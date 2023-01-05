import { LoginUserRequestDto, RegisterRequestDto } from '../dto/requests';
import { GetUserTokens } from '../type';

export abstract class AuthService {
  abstract register(dto: RegisterRequestDto): Promise<void>;

  abstract loginUser(dto: LoginUserRequestDto): Promise<GetUserTokens>;
}
