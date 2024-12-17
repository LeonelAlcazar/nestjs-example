import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { OperatorAuthGuard } from '../guards/operator-auth/operator-auth.guard';

export function OperatorAuthentication() {
  return applyDecorators(
    UseGuards(OperatorAuthGuard),
    ApiBearerAuth('operator auth'),
  );
}
