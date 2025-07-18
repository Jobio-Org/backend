import { ClientException } from '~core/exceptions/domain/exceptions/client-exception/client.exception';

import { type CompanyRoleType } from '~modules/companies/domain/enums/company-management.enum';

export class InvalidRoleException extends ClientException {
  public static readonly CODE = 'INVALID_ROLE';

  constructor(role: CompanyRoleType, message?: string) {
    super(InvalidRoleException.CODE, message || `${role} role not found in database`);
  }
}
