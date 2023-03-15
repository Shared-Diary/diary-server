import { IsString } from 'class-validator';

export class SendSmsRequestDto {
  @IsString()
  readonly recipientNo: string;
}
