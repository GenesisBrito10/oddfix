import { SetMetadata } from '@nestjs/common';

export type AppRole = 'USER' | 'ADMIN';

export const ROLES_KEY = 'roles';

/** Restricts a route/controller to the given roles (enforced by RolesGuard). */
export const Roles = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);
