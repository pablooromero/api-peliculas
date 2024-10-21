
import { applyDecorators, UseGuards } from '@nestjs/common';
import { RoleEnum } from 'src/core';
import { RoleProtected } from './role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role-guard/user-role.guard';

export function Auth(...roles: RoleEnum[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
