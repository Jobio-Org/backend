import { ClientException } from '~core/exceptions/domain/exceptions/client-exception/client.exception';

export class InvitationAlreadyAcceptedException extends ClientException {
  public static readonly CODE = 'INVITATION_ALREADY_ACCEPTED';

  constructor(message: string = 'Invitation has already been accepted') {
    super(InvitationAlreadyAcceptedException.CODE, message);
  }
}
