import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LotteryTicketCreateDTO {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  amount: number;

  @IsString()
  @Length(10)
  @IsNotEmpty()
  @ApiProperty()
  number: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  lotteryId: string;
}
