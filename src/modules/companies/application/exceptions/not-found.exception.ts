import { NotFoundException } from '~core/exceptions/domain/exceptions/not-found-exception/not-found.exception';

export class EntityNotFoundException extends NotFoundException {
  public static readonly CODE = 'ENTITY_NOT_FOUND';

  constructor(
    entityType:
      | 'company'
      | 'company-permission'
      | 'company-role'
      | 'company-role-permission'
      | 'user-details'
      | 'recruiter-profile',
    id: string,
    message?: string,
  ) {
    super(EntityNotFoundException.CODE, message ?? `${entityType} with id ${id} not found`);
  }
}
