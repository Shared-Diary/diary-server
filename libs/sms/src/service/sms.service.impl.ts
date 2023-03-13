import { Injectable } from '@nestjs/common';

import { SmsService } from '@app/sms';
import { TwilloConfigProvider } from '@app/twillo';

import { FailedToSendMessageException } from '../exception';

@Injectable()
export class SmsServiceImpl implements SmsService {
  constructor(private readonly twilloConfigProvider: TwilloConfigProvider) {}

  async sendMessage(to: string, message: string): Promise<void> {
    try {
      const client = this.twilloConfigProvider.getClient();

      await client.messages.create({
        body: message,
        from: this.twilloConfigProvider.getFromNumber(),
        to,
      });
    } catch (error) {
      throw new FailedToSendMessageException();
    }
  }
}
