import { UserContextException } from '~modules/user-context/application/exceptions/user-context.exception';

import { type UserRole } from '~shared/domain/enums/user-role.enum';

export class InvalidUserRoleException extends UserContextException {
  constructor(userRole: UserRole, originalError: unknown | null = null) {
    super('INVALID_USER_ROLE', `Invalid user role: ${userRole}`, originalError);
  }
}
