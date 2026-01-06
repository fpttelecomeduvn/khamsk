import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../../../shared/types';

export const ROLES_KEY = 'roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        `User role ${user?.role} is not allowed to access this resource`,
      );
    }

    return true;
  }
}

/**
 * Decorator: @Roles(UserRole.ADMIN)
 */
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: UserRole[]) =>
  SetMetadata(ROLES_KEY, roles);
