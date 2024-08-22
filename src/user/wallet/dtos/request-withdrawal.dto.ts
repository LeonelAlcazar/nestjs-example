import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class RequestWithdrawal {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  amount: number;
}
