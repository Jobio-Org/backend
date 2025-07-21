import { ClientException } from '~core/exceptions/domain/exceptions/client-exception/client.exception';

export class UserAlreadyExistsException extends ClientException {
  public static readonly CODE = 'USER_ALREADY_EXISTS';

  constructor(message?: string) {
    super(UserAlreadyExistsException.CODE, message ?? 'User with this email already exists');
  }
}
