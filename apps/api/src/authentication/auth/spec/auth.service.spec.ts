import { Test, TestingModule } from '@nestjs/testing';

import { PasswordEncoderService } from '@app/password-encoder';
import { Mock } from '@app/shared/type';

import { AuthService, AuthServiceImpl } from '../service';
import { AuthController } from '../controller';
import { UserService } from '../../../user/service';
import { LoginUserRequestDto, RegisterRequestDto } from '../dto/requests';
import { AccessTokenService } from '../../token/service';
import { PasswordMismatchException } from '../exception';
import { JwtStrategy } from '../strategy/jwt.strategy';
import ThrottlerModule from '../../../configs/modules/throttler.module';

describe('Auth Service', () => {
  let authService: AuthService;
  let userService: Mock<UserService>;
  let passwordEncoderService: Mock<PasswordEncoderService>;
  let accessTokenService: Mock<AccessTokenService>;

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
      ],
    }).compile();

    authService = await module.get<AuthService>(AuthService);
    userService = await module.get(UserService);
    passwordEncoderService = await module.get(PasswordEncoderService);
    accessTokenService = await module.get(AccessTokenService);
  });

  describe('register', () => {
    it('???????????? ??????', async () => {
      const dto: RegisterRequestDto = {
        email: 'test@test.com',
        password: 'testpassword!@',
      };
      const result = await authService.register(dto);

      expect(passwordEncoderService.encode).toHaveBeenCalledTimes(1);
      expect(userService.createUser).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });
  });

  describe('loginUser', () => {
    it('??????????????? ???????????? ?????? ?????? Unauthorized Exception ??? ????????????', async () => {
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

    it('?????? ????????? ??????', async () => {
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
});
