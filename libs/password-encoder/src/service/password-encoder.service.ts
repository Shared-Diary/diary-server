export abstract class PasswordEncoderService {
  abstract encode(password: string): Promise<string>;

  abstract isMatches(
    password: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
