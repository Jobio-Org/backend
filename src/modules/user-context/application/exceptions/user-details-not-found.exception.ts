import { NotFoundException } from '~core/exceptions/domain/exceptions/not-found-exception/not-found.exception';

export class UserDetailsNotFoundException extends NotFoundException {
  constructor(userId: string, originalError: unknown | null = null) {
    super('USER_DETAILS_NOT_FOUND', `User details for user with ID ${userId} not found`, originalError);
  }
}
