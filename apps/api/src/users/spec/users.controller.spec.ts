import { Test, TestingModule } from '@nestjs/testing';

import { PrismaModule } from '@app/prisma';

import { UsersController } from '../controller';
import { UserService } from '../service';
import { UserRepository } from '../repository';
import ThrottlerModule from '../../configs/modules/throttler.module';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUserService = () => ({
    createUser: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, ThrottlerModule],
      controllers: [UsersController],
      providers: [
        {
          provide: UserService,
          useFactory: mockUserService,
        },
        UserRepository,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
