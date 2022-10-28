import { Test, TestingModule } from '@nestjs/testing';

import { PrismaModule } from '@app/prisma';

import { UsersController } from '../controller';
import { UsersService } from '../service';
import { UsersRepository } from '../repository';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = () => ({
    createUser: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useFactory: mockUsersService,
        },
        UsersRepository,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
