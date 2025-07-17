import { ClientException } from '~core/exceptions/domain/exceptions/client-exception/client.exception';

export class InsufficientPermissionsException extends ClientException {
  public static readonly CODE = 'INSUFFICIENT_PERMISSIONS';

  constructor(message: string = 'Insufficient permissions to perform this action') {
    super(InsufficientPermissionsException.CODE, message);
  }
}
