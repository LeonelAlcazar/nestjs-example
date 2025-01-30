import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDateString, IsNotEmpty } from 'class-validator';

@InputType()
export class LotteryCreateDTO {
  @IsDate()
  @IsNotEmpty()
  @ApiProperty()
  @Field()
  endAt: Date;
}
