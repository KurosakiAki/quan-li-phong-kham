import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { UserRoleEnum } from '@api-interfaces';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return roles.some(r => user.userRoleCode === UserRoleEnum.ADMIN || r === user.userRoleCode);
  }
}
