import { NotFoundException } from '~core/exceptions/domain/exceptions/not-found-exception/not-found.exception';

export class InvitationNotFoundException extends NotFoundException {
  public static readonly CODE = 'INVITATION_NOT_FOUND';

  constructor(message: string = 'Invitation not found') {
    super(InvitationNotFoundException.CODE, message);
  }
}
