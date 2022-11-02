import { Test, TestingModule } from '@nestjs/testing';

import { PasswordEncoderService } from '@app/password-encoder';
import { Mock } from '@app/shared/type';

import { AuthService, AuthServiceImpl } from '../service';
import { AuthController } from '../controller';
import { UsersService } from '../../../users/service';
import { LoginUserRequestDto, RegisterRequestDto } from '../dto';
import { AccessTokenService } from '../../token/service';
import { PasswordMismatchException } from '../exception';

describe('Auth Service', () => {
  let authService: AuthService;
  let usersService: Mock<UsersService>;
  let passwordEncoderService: Mock<PasswordEncoderService>;
  let accessTokenService: Mock<AccessTokenService>;

  const mockUsersService = () => ({
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useClass: AuthServiceImpl,
        },
        {
          provide: UsersService,
          useFactory: mockUsersService,
        },
        {
          provide: PasswordEncoderService,
          useFactory: mockPasswordEncoderService,
        },
        {
          provide: AccessTokenService,
          useFactory: mockAccessTokenService,
        },
      ],
    }).compile();

    authService = await module.get<AuthService>(AuthService);
    usersService = await module.get(UsersService);
    passwordEncoderService = await module.get(PasswordEncoderService);
    accessTokenService = await module.get(AccessTokenService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('회원가입 성공', async () => {
      const dto: RegisterRequestDto = {
        email: 'test@test.com',
        password: 'testpassword!@',
      };
      const result = await authService.register(dto);

      expect(passwordEncoderService.encode).toHaveBeenCalledTimes(1);
      expect(usersService.createUser).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });
  });

  describe('loginUser', () => {
    it('비밀번호가 일치하지 않을 경우 Unauthorized Exception 을 전송한다', async () => {
      passwordEncoderService.isMatches.mockResolvedValue(false);
      usersService.findUserByEmail.mockResolvedValue('data');
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
      usersService.findUserByEmail.mockResolvedValue('data');
      accessTokenService.generateAccessToken.mockResolvedValue('accessToken');

      const dto: LoginUserRequestDto = {
        email: 'test@test.com',
        password: 'testpassword!@',
      };
      const result = await authService.loginUser(dto);

      expect(await result.accessToken).toBe('accessToken');
      expect(usersService.findUserByEmail).toHaveBeenCalledTimes(1);
      expect(passwordEncoderService.isMatches).toHaveBeenCalledTimes(1);
      expect(accessTokenService.generateAccessToken).toHaveBeenCalledTimes(1);
    });
  });
});
