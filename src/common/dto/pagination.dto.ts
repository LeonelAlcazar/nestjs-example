import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDTO {
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  page: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  limit: number;
}
