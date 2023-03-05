import { Test, TestingModule } from '@nestjs/testing';

import { SmsService, SmsServiceImpl } from '@app/sms/service';
import { TwilloConfigProvider } from '@app/twillo';
import { Mock } from '@app/shared/type';

describe('SmsService', () => {
  let smsService: SmsService;
  let twilloConfigProvider: Mock<TwilloConfigProvider>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SmsService,
          useClass: SmsServiceImpl,
        },
        {
          provide: TwilloConfigProvider,
          useFactory: () => ({
            getClient: jest.fn(),
          }),
        },
      ],
    }).compile();

    smsService = module.get<SmsService>(SmsService);
    twilloConfigProvider = module.get(TwilloConfigProvider);
  });

  it('should be defined', () => {
    expect(smsService).toBeDefined();
  });

  describe('sms 전송', () => {
    it('메세지 전송 성공', async () => {
      twilloConfigProvider.getClient.mockImplementation(() => ({
        messages: {
          create: jest.fn(),
        },
      }));

      const result = await smsService.sendMessage('+821012345678', 'message');

      expect(result).toBeUndefined();
      expect(twilloConfigProvider.getClient).toHaveBeenCalledTimes(1);
    });
  });
});
