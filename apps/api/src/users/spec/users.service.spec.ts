import { Test, TestingModule } from '@nestjs/testing';

import { UsersService, UsersServiceImpl } from '../service';
import { UsersController } from '../controller';
import { UsersRepository } from '../repository';

describe('UsersService', () => {
  let service: UsersService;

  const mockUsersRepository = () => ({
    create: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useClass: UsersServiceImpl,
        },
        {
          provide: UsersRepository,
          useFactory: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
