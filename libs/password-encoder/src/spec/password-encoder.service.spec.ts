import { Test, TestingModule } from '@nestjs/testing';

import {
  PasswordEncoderInterface,
  BcryptPasswordEncoderService,
  IPasswordEncoder,
} from '../service';

describe('PasswordEncoderService', () => {
  let passwordEncoderService: PasswordEncoderInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IPasswordEncoder,
          useClass: BcryptPasswordEncoderService,
        },
      ],
    }).compile();

    passwordEncoderService = await module.get<PasswordEncoderInterface>(
      IPasswordEncoder,
    );
  });

  describe('비밀번호 Encode', () => {
    it('암호화된 비밀번호는 기존 비밀번호와 다른지 확인', async () => {
      const password = 'test' as string;
      const hashedPassword = await passwordEncoderService.encode(password);

      expect(hashedPassword).not.toBe(password);
    });
  });

  describe('비밀번호 Match', () => {
    it('암호화된 비밀번호가 맞는지 확인', async () => {
      const password = 'test' as string;
      const hashedPassword = await passwordEncoderService.encode(password);

      const isMatched = await passwordEncoderService.isMatches(
        password,
        hashedPassword,
      );

      expect(isMatched).toBe(true);
    });
  });
});
