import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

import { MIN_PAGE, MIN_PAGE_SIZE } from '@api/shared/constant';

export class PaginationRequestDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(MIN_PAGE)
  readonly page: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(MIN_PAGE_SIZE)
  readonly pageSize: number;
}
