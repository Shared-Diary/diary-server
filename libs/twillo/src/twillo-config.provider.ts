import { Injectable } from '@nestjs/common';
import TwilioClient from 'twilio/lib/rest/Twilio';
import { Twilio } from 'twilio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwilloConfigProvider {
  private readonly client: TwilioClient;

  private readonly fromPhoneNumber = '+15673688414';

  constructor(private readonly configService: ConfigService) {
    this.client = new Twilio(
      this.configService.get<string>('ACCOUNT_SID'),
      this.configService.get<string>('AUTH_TOKEN'),
    );
  }

  getClient(): TwilioClient {
    return this.client;
  }

  getFromNumber() {
    return this.fromPhoneNumber;
  }
}
