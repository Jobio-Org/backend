import { NotFoundException } from '~core/exceptions/domain/exceptions/not-found-exception/not-found.exception';

export class EntityNotFoundException extends NotFoundException {
  public static readonly CODE = 'ENTITY_NOT_FOUND';

  constructor(entityType: 'company' | 'company-permission' | 'company-role' | 'company-role-permission', id: string) {
    super(EntityNotFoundException.CODE, `${entityType} with id ${id} not found`);
  }
}
