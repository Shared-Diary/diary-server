import { Test, TestingModule } from '@nestjs/testing';
import { AccessTokenService } from '../access-token.service';

describe('Access Token Service', () => {
  let accessTokenService: AccessTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccessTokenService],
    }).compile();

    accessTokenService = module.get<AccessTokenService>(AccessTokenService);
  });

  it('should be defined', () => {
    expect(accessTokenService).toBeDefined();
  });
});
