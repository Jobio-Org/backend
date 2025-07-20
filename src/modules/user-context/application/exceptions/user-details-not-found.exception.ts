import { UserContextException } from '~modules/user-context/application/exceptions/user-context.exception';

export class UserDetailsNotFoundException extends UserContextException {
  constructor(userId: string, originalError: unknown | null = null) {
    super('USER_DETAILS_NOT_FOUND', `User details for user with ID ${userId} not found`, originalError);
  }
}
