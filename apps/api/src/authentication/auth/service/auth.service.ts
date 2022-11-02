import {
  LoginUserRequestDto,
  LoginUserResponseDto,
  RegisterRequestDto,
} from '../dto';

export abstract class AuthService {
  abstract register(dto: RegisterRequestDto): Promise<void>;

  abstract loginUser(dto: LoginUserRequestDto): Promise<LoginUserResponseDto>;
}
