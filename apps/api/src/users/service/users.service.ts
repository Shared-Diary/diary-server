export abstract class UsersService {
  abstract validateIsExistEmail(email: string): Promise<void>;
}
