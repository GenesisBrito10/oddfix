import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppRole, ROLES_KEY } from '../decorators/roles.decorator';
import { AuthTokenPayload } from '../../modules/auth/domain/services/token-service.interface';

/**
 * Enforces @Roles. Must run after JwtAuthGuard (which populates request.user).
 * Routes with no @Roles metadata are allowed through.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AppRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<{ user?: AuthTokenPayload }>();
    const role = request.user?.role;

    if (!role || !requiredRoles.includes(role as AppRole)) {
      throw new ForbiddenException('Forbidden');
    }

    return true;
  }
}
