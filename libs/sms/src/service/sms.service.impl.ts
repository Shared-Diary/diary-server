import { Injectable } from '@nestjs/common';

import { SmsService } from '@app/sms';
import { TwilloConfigProvider } from '@app/twillo';

import { FailedToSendMessageException } from '../exception';

@Injectable()
export class SmsServiceImpl implements SmsService {
  private readonly fromPhoneNumber = '+15673688414';

  constructor(private readonly twilloConfigProvider: TwilloConfigProvider) {}

  async sendMessage(to: string, message: string): Promise<void> {
    try {
      const client = this.twilloConfigProvider.getClient();

      await client.messages.create({
        body: message,
        from: this.fromPhoneNumber,
        to,
      });
    } catch (error) {
      throw new FailedToSendMessageException();
    }
  }
}
