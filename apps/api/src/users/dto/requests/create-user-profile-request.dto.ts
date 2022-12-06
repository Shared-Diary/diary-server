import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserProfileRequestDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  readonly nickName: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  readonly introduce: string;
}
