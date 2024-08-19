import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PaginationDTO {
  @IsNumber()
  @ApiProperty()
  page: number;

  @IsNumber()
  @ApiProperty()
  limit: number;
}
