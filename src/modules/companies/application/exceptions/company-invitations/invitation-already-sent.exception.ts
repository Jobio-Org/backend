import { ClientException } from '~core/exceptions/domain/exceptions/client-exception/client.exception';

export class InvitationAlreadySentException extends ClientException {
  public static readonly CODE = 'INVITATION_ALREADY_SENT';

  constructor(message?: string) {
    super(InvitationAlreadySentException.CODE, message ?? 'Invitation already sent to this email for this company');
  }
}
