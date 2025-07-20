import { UserContextException } from '~modules/user-context/application/exceptions/user-context.exception';

import { type UserRole } from '~shared/domain/enums/user-role.enum';

export class AccessDeniedException extends UserContextException {
  constructor(userRole: UserRole, requiredRoles: UserRole[], originalError: unknown | null = null) {
    super(
      'ACCESS_DENIED',
      `Access denied. User role: ${userRole}. Required roles: ${requiredRoles.join(', ')}`,
      originalError,
    );
  }
}
