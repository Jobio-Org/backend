import { ClientException } from '~core/exceptions/domain/exceptions/client-exception/client.exception';

export class InvitationExpiredException extends ClientException {
  public static readonly CODE = 'INVITATION_EXPIRED';

  constructor(message: string = 'Invitation has expired') {
    super(InvitationExpiredException.CODE, message);
  }
}
