import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class VerifySmsCodeRequestDto {
  @IsNotEmpty()
  @IsInt()
  readonly code: number;

  @IsNotEmpty()
  @IsString()
  readonly recipientNo: string;
}
