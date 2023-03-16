import { IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifySmsCodeRequestDto {
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  readonly code: string;

  @IsNotEmpty()
  @IsString()
  readonly recipientNo: string;
}
