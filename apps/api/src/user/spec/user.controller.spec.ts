import { Test, TestingModule } from '@nestjs/testing';

import { PrismaModule } from '@app/prisma';

import { UserController } from '../controller';
import { UserService } from '../service';
import { UserRepository } from '../repository';
import ThrottlerModule from '../../configs/modules/throttler.module';

describe('UsersController', () => {
  let controller: UserController;

  const mockUsersService = () => ({
    createUser: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, ThrottlerModule],
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useFactory: mockUsersService,
        },
        UserRepository,
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
