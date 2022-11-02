import { Test, TestingModule } from '@nestjs/testing';

import { PasswordEncoderService } from '@app/password-encoder';

import { AuthService, AuthServiceImpl } from '../service';
import { AuthController } from '../controller';
import { UsersService } from '../../../users/service';

describe('Auth Service', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let passwordEncoderService: PasswordEncoderService;

  const mockUsersService = () => ({
    createUser: jest.fn(),
  });

  const mockPasswordEncoderService = () => ({
    encode: jest.fn(),
    isMatches: jest.fn(),
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
      ],
    }).compile();

    authService = await module.get<AuthService>(AuthService);
    usersService = await module.get<UsersService>(UsersService);
    passwordEncoderService = await module.get<PasswordEncoderService>(
      PasswordEncoderService,
    );
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('회원가입 성공', async () => {
      const dto = {
        email: 'test@test.com',
        password: 'testpassword!@',
      };
      const result = await authService.register(dto);

      expect(passwordEncoderService.encode).toHaveBeenCalledTimes(1);
      expect(usersService.createUser).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });
  });
});
