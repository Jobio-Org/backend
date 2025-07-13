import { ClientException } from '~core/exceptions/domain/exceptions/client-exception/client.exception';

export class InsufficientPermissionsException extends ClientException {
  public static readonly CODE = 'INSUFFICIENT_PERMISSIONS';
 
  constructor(message?: string) {
    super(InsufficientPermissionsException.CODE, message || 'Insufficient permissions to perform this action');
  }
} 