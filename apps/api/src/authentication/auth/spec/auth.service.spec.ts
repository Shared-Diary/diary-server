import { Test, TestingModule } from '@nestjs/testing';

import { PasswordEncoderService } from '@app/password-encoder';
import { Mock } from '@app/shared/type';

import { SmsService } from '@app/sms';
import { CacheService } from '@app/cache';
import { AuthService, AuthServiceImpl } from '../service';
import { AuthController } from '../controller';
import { UserService } from '../../../user/service';
import { LoginUserRequestDto, RegisterRequestDto } from '../dto/requests';
import { AccessTokenService } from '../../token/service';
import {
  NoSmsAuthenticationException,
  PasswordMismatchException,
  VerificationCodeMismatchException,
} from '../exception';
import { JwtStrategy } from '../strategy/jwt.strategy';
import ThrottlerModule from '../../../configs/modules/throttler.module';

describe('Auth Service', () => {
  let authService: AuthService;
  let userService: Mock<UserService>;
  let passwordEncoderService: Mock<PasswordEncoderService>;
  let accessTokenService: Mock<AccessTokenService>;
  let smsService: Mock<SmsService>;
  let cacheService: Mock<CacheService>;

  const mockUserService = () => ({
    createUser: jest.fn(),
    findUserByEmail: jest.fn(),
  });

  const mockPasswordEncoderService = () => ({
    encode: jest.fn(),
    isMatches: jest.fn(),
  });

  const mockAccessTokenService = () => ({
    generateAccessToken: jest.fn(),
  });

  const mockJwtStrategy = () => ({});

  const mockSmsService = () => ({
    sendMessage: jest.fn(),
  });

  const mockCacheService = () => ({
    set: jest.fn(),
    get: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ThrottlerModule],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useClass: AuthServiceImpl,
        },
        {
          provide: UserService,
          useFactory: mockUserService,
        },
        {
          provide: PasswordEncoderService,
          useFactory: mockPasswordEncoderService,
        },
        {
          provide: AccessTokenService,
          useFactory: mockAccessTokenService,
        },
        {
          provide: JwtStrategy,
          useFactory: mockJwtStrategy,
        },
        {
          provide: SmsService,
          useFactory: mockSmsService,
        },
        {
          provide: CacheService,
          useFactory: mockCacheService,
        },
      ],
    }).compile();

    authService = await module.get<AuthService>(AuthService);
    userService = await module.get(UserService);
    passwordEncoderService = await module.get(PasswordEncoderService);
    accessTokenService = await module.get(AccessTokenService);
    smsService = await module.get(SmsService);
    cacheService = await module.get(CacheService);
  });

  describe('register', () => {
    it('회원가입 성공', async () => {
      cacheService.get.mockResolvedValue('ok');
      const dto: RegisterRequestDto = {
        email: 'test@test.com',
        password: 'testpassword!@',
        phone: '+821012345678',
      };
      const result = await authService.register(dto);

      expect(passwordEncoderService.encode).toHaveBeenCalledTimes(1);
      expect(userService.createUser).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it('sms 인증이 만료된 유저는 예외처리를 한다', async () => {
      cacheService.get.mockResolvedValue(undefined);
      const dto: RegisterRequestDto = {
        email: 'test@test.com',
        password: 'testpassword!@',
        phone: '+821012345678',
      };

      await expect(async () => {
        await authService.register(dto);
      }).rejects.toThrow(new NoSmsAuthenticationException());
    });

    it('cache 에 저장된 값이 ok 라는 값이 아니라면 예외처리를 한다', async () => {
      cacheService.get.mockResolvedValue('not ok');
      const dto: RegisterRequestDto = {
        email: 'test@test.com',
        password: 'testpassword!@',
        phone: '+821012345678',
      };

      await expect(async () => {
        await authService.register(dto);
      }).rejects.toThrow(new NoSmsAuthenticationException());
    });
  });

  describe('loginUser', () => {
    it('비밀번호가 일치하지 않을 경우 Unauthorized Exception 을 전송한다', async () => {
      passwordEncoderService.isMatches.mockResolvedValue(false);
      userService.findUserByEmail.mockResolvedValue('data');
      const dto: LoginUserRequestDto = {
        email: 'test@test.com',
        password: 'testpassword!@',
      };

      await expect(async () => {
        await authService.loginUser(dto);
      }).rejects.toThrow(new PasswordMismatchException());
    });

    it('유저 로그인 성공', async () => {
      passwordEncoderService.isMatches.mockResolvedValue(true);
      userService.findUserByEmail.mockResolvedValue('data');
      accessTokenService.generateAccessToken.mockResolvedValue('accessToken');

      const dto: LoginUserRequestDto = {
        email: 'test@test.com',
        password: 'testpassword!@',
      };
      const userTokens = await authService.loginUser(dto);

      expect(await userTokens.accessToken).toBe('accessToken');
      expect(userService.findUserByEmail).toHaveBeenCalledTimes(1);
      expect(passwordEncoderService.isMatches).toHaveBeenCalledTimes(1);
      expect(accessTokenService.generateAccessToken).toHaveBeenCalledTimes(1);
    });
  });

  describe('sendAuthSms', () => {
    it('Sms 인증 메시지 전송 성공', async () => {
      const result = await authService.sendAuthSms({
        recipientNo: '+821012345678',
      });

      expect(result).toBeUndefined();
      expect(smsService.sendMessage).toHaveBeenCalledTimes(1);
      expect(cacheService.set).toHaveBeenCalledTimes(1);
    });
  });

  describe('verifySmsCode', () => {
    it('Sms Code 인증 성공', async () => {
      cacheService.get.mockResolvedValue(123456);

      const result = await authService.verifySmsCode({
        recipientNo: '+821012345678',
        code: 123456,
      });

      expect(result).toBeUndefined();
      expect(cacheService.get).toHaveBeenCalledTimes(1);
      expect(cacheService.set).toHaveBeenCalledTimes(1);
    });

    it('Cache 의 Code 와 Request 받은 Code 가 다를 경우 예외처리 한다', async () => {
      cacheService.get.mockResolvedValue(123456);

      await expect(async () => {
        await authService.verifySmsCode({
          recipientNo: '+821012345678',
          code: 654321,
        });
      }).rejects.toThrow(new VerificationCodeMismatchException());
    });

    it('Cache 의 Code 값이 없을 경우 예외처리 한다', async () => {
      cacheService.get.mockResolvedValue(undefined);

      await expect(async () => {
        await authService.verifySmsCode({
          recipientNo: '+821012345678',
          code: 654321,
        });
      }).rejects.toThrow(new VerificationCodeMismatchException());
    });
  });
});
