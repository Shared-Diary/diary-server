import { Test, TestingModule } from '@nestjs/testing';

import { AuthService, AuthServiceImpl } from '../service';
import { AuthController } from '../controller';

describe('Auth Service', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useClass: AuthServiceImpl,
        },
      ],
    }).compile();

    authService = await module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
});
