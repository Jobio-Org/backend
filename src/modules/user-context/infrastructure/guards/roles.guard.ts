import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { type Request } from 'express';

import { AccessDeniedException } from '~modules/user-context/application/exceptions/access-denied.exception';
import { UserContextService } from '~modules/user-context/application/services/user-context.service';
import { ROLES_KEY } from '~modules/user-context/infrastructure/decorators/roles.decorator';

import { UserRole } from '~shared/domain/enums/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userContextService: UserContextService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      const request: Request = context.switchToHttp().getRequest();
      const userId = request.user?.id;

      const userContext = await this.userContextService.getUserContext(userId);
      const userRole = userContext.role;

      const hasRole = requiredRoles.includes(userRole);

      if (!hasRole) {
        throw new AccessDeniedException(userRole, requiredRoles);
      }

      return true;
    } catch (error) {
      if (error instanceof AccessDeniedException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('Failed to verify user role');
    }
  }
}
