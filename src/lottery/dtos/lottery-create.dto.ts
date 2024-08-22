import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class LotteryCreateDTO {
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  endAt: Date;
}
