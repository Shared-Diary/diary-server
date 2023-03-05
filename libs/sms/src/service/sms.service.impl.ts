import { Injectable } from '@nestjs/common';

import { SmsService } from '@app/sms';

@Injectable()
export class SmsServiceImpl implements SmsService {}
