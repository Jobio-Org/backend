import { ClientException } from '~core/exceptions/domain/exceptions/client-exception/client.exception';

export class UserNotRecruiterException extends ClientException {
  public static readonly CODE = 'USER_NOT_RECRUITER';

  constructor(message: string = 'User is not a recruiter') {
    super(UserNotRecruiterException.CODE, message);
  }
}
