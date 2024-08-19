import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { PaginationDTO } from 'src/common/dto/pagination.dto';

export class UserFindDTO extends PaginationDTO {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  email: string;
}
