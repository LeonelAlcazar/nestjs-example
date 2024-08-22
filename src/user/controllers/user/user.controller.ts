import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { UrlUtilsService } from 'src/common/services/url-utils/url-utils.service';
import { OperatorAuthentication } from 'src/operator/decorators/operator-authentication.decorator';
import { UserAuthentication } from 'src/user/decorators/user-authentication.decorator';
import { UserFindDTO } from 'src/user/dtos/user-find.dto';
import { UserRegisterDTO } from 'src/user/dtos/user-register.dto';
import { UserAuthGuard } from 'src/user/guards/user-auth/user-auth.guard';
import { UserService } from 'src/user/services/user/user.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private urlUtilsService: UrlUtilsService,
  ) {}

  @OperatorAuthentication()
  @Get('/')
  async findAll(@Query() query: UserFindDTO) {
    const { criteria, pagination } =
      this.urlUtilsService.getPaginationAndCriteriaFromQuery(query);

    return this.userService.findAll(criteria, pagination);
  }

  @UserAuthentication()
  @Get('/me')
  async me(@Req() req: Request) {
    return this.userService.findOne({ id: req['user'].id });
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne({ id });
  }

  @Post('/')
  async register(@Body() data: UserRegisterDTO) {
    return this.userService.register(data);
  }
}
