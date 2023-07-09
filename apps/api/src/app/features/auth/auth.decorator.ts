import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { AuthGuard } from '@nestjs/passport';

import {
  ApiResponse,
} from '@nestjs/swagger';
import { UserRoleEnum } from '@api-interfaces';

export const Auth = (...roles: string[]) => {
  const decorators = [
    SetMetadata('roles', roles),
    UseGuards(AuthGuard('jwt'), RolesGuard),
  ];

  if (roles.length) {
    decorators.push(ApiResponse({ status: 403, description: `Forbidden. Required roles: [${roles}]` }));
  } else {
    decorators.push(ApiResponse({ status: 401, description: `Required Login` }));
  }

  return applyDecorators(
    ...decorators,
  );
};
