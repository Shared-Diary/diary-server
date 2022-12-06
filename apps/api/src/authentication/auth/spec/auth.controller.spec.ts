import { Test, TestingModule } from '@nestjs/testing';

import { PrismaModule } from '@app/prisma';

import { AuthController } from '../controller';
import { AuthService } from '../service';
import { UserModule } from '../../../users/user.module';
import { JwtStrategy } from '../strategy/jwt.strategy';
import ThrottlerModule from '../../../configs/modules/throttler.module';

describe('Auth Controller', () => {
  let authController: AuthController;

  const mockAuthService = () => ({
    register: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, UserModule, ThrottlerModule],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useFactory: mockAuthService,
        },
        {
          provide: JwtStrategy,
          useFactory: () => ({}),
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });
});
