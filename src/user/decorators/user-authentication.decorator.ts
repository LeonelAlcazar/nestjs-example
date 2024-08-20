import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserAuthGuard } from '../guards/user-auth/user-auth.guard';

export function UserAuthentication() {
  return applyDecorators(UseGuards(UserAuthGuard), ApiBearerAuth('user auth'));
}
