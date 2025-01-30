import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { LotteryStatus } from '../entities/lottery.entity';
import { IsEnum, IsOptional } from 'class-validator';

@InputType()
export class LotteryListDTO {
  @IsOptional()
  @IsEnum(LotteryStatus)
  @ApiProperty()
  @Field(() => String)
  status: LotteryStatus;
}
