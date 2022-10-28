import { Test, TestingModule } from '@nestjs/testing';

import { AuthService, AuthServiceImpl } from '../service';
import { AuthController } from '../controller';
import { UsersService } from '../../../users/service';

describe('Auth Service', () => {
  let authService: AuthService;
  let usersService;

  const mockUsersService = () => ({
    validateIsExistEmail: jest.fn(),
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
      ],
    }).compile();

    authService = await module.get<AuthService>(AuthService);
    usersService = await module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('Register', () => {
    it('회원가입 성공', async () => {
      const dto = {
        email: 'test@test.com',
        password: 'testpassword!@',
      };
      const result = await authService.register(dto);

      expect(usersService.validateIsExistEmail).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });
  });
});
