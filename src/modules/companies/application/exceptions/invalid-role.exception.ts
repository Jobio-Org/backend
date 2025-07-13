import { ServerException } from '~core/exceptions/domain/exceptions/server-exception/server.exception';

import { CompanyRoleType } from '~modules/companies/domain/enums/company-management.enum';

export class InvalidRoleException extends ServerException {
  public static readonly CODE = 'INVALID_ROLE';

  constructor(role: CompanyRoleType, message?: string) {
    super(InvalidRoleException.CODE, message || `${role} role not found in database`);
  }
}
