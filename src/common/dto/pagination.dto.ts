import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNumberString, IsOptional } from 'class-validator';

export class PaginationDTO {
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  page: number;

  @IsNumberString()
  @IsOptional()
  @ApiProperty()
  limit: number;
}
