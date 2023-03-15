import {
  LoginUserRequestDto,
  RegisterRequestDto,
  SendSmsRequestDto,
} from '../dto/requests';
import { GetUserTokens } from '../type';

export abstract class AuthService {
  abstract register(dto: RegisterRequestDto): Promise<void>;

  abstract loginUser(dto: LoginUserRequestDto): Promise<GetUserTokens>;

  abstract sendAuthSms(dto: SendSmsRequestDto): Promise<void>;
}
