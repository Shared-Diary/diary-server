export const IPasswordEncoder = Symbol('PasswordEncoderInterface');

export interface PasswordEncoderInterface {
  encode(password: string): Promise<string>;

  isMatches(password: string, hashedPassword: string): Promise<boolean>;
}
