import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class ChangeWithdrawalStatus {
  @IsString()
  @IsNotEmpty()
  @IsEnum(['approved', 'rejected'])
  @ApiProperty()
  status: string;
}
