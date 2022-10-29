import { Test, TestingModule } from '@nestjs/testing';

import { PrismaModule } from '@app/prisma';

import { AuthController } from '../controller';
import { AuthService } from '../service';
import { UsersModule } from '../../../users/users.module';

describe('Auth Controller', () => {
  let authController: AuthController;

  const mockAuthService = () => ({
    register: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, UsersModule],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useFactory: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });
});
