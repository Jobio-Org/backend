import { ServerException } from '~core/exceptions/domain/exceptions/server-exception/server.exception';

export class InvalidRoleException extends ServerException {
  public static readonly CODE = 'INVALID_ROLE';

  constructor(message: string) {
    super(InvalidRoleException.CODE, message);
  }
}
