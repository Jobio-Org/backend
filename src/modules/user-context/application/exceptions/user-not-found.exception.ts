import { UserContextException } from '~modules/user-context/application/exceptions/user-context.exception';

export class UserNotFoundException extends UserContextException {
  constructor(userId: string, originalError: unknown | null = null) {
    super('USER_NOT_FOUND', `User with ID ${userId} not found`, originalError);
  }
}
