import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.roles) {
      throw new ForbiddenException('Accès refusé : utilisateur non authentifié ou rôles manquants.');
    }

    const hasRole = user.roles.some((userRole: any) => {
      if (typeof userRole === 'string') {
        return requiredRoles.includes(userRole);
      }
      if (typeof userRole === 'object' && userRole.nom) {
        return requiredRoles.includes(userRole.nom);
      }
      return false;
    });

    if (!hasRole) {
      throw new ForbiddenException('Accès refusé : rôle insuffisant.');
    }

    return true;
  }
}
