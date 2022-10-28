import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from '../controller';
import { AuthService, AuthServiceImpl } from '../service';
import { UsersModule } from '../../../users/users.module';

describe('Auth Controller', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useClass: AuthServiceImpl,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });
});
