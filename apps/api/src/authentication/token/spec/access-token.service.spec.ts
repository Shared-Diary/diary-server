import { Test, TestingModule } from '@nestjs/testing';

import { AccessTokenService } from '../service/access-token.service';
import { InvalidAccessTokenFormatException } from '../exception';
import { AccessTokenServiceImpl } from '../service/access-token.service.impl';

describe('Access Token Service', () => {
  let accessTokenService: AccessTokenService;
  let jwtService;

  const mockJwtService = () => ({
    sign: jest.fn().mockResolvedValue('accessToken'),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AccessTokenService,
          useClass: AccessTokenServiceImpl,
        },
        {
          provide: 'JwtService',
          useFactory: mockJwtService,
        },
      ],
    }).compile();

    accessTokenService = await module.get<AccessTokenService>(
      AccessTokenService,
    );
    jwtService = await module.get<'JwtService'>('JwtService');
  });

  describe('Generate Access Token', () => {
    it('Access Token 생성 성공', async () => {
      const result = await accessTokenService.generateAccessToken({
        userId: 1,
      });

      expect(result).toBe('accessToken');
    });

    it('매개변수에 userId 값이 null 이라면 InvalidAccessTokenFormatException 을 던진다', async () => {
      await expect(async () => {
        accessTokenService.generateAccessToken({ userId: null });
      }).rejects.toThrow(new InvalidAccessTokenFormatException());
    });

    it('매개변수에 userId 값이 undefined 이라면 InvalidAccessTokenFormatException 을 던진다', async () => {
      await expect(async () => {
        accessTokenService.generateAccessToken({ userId: undefined });
      }).rejects.toThrow(new InvalidAccessTokenFormatException());
    });
  });
});
