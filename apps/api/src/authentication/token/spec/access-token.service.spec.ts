import { Test, TestingModule } from '@nestjs/testing';

import { AccessTokenService } from '../access-token.service';

describe('Access Token Service', () => {
  let accessTokenService: AccessTokenService;

  const mockJwtService = () => ({
    sign: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessTokenService,
        {
          provide: 'JwtService',
          useFactory: mockJwtService,
        },
      ],
    }).compile();

    accessTokenService = await module.get<AccessTokenService>(
      AccessTokenService,
    );
  });

  it('should be defined', () => {
    expect(accessTokenService).toBeDefined();
  });
});
