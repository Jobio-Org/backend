import { NotFoundException } from '~core/exceptions/domain/exceptions/not-found-exception/not-found.exception';

export class EntityNotFoundByNameException extends NotFoundException {
  public static readonly CODE = 'ENTITY_NOT_FOUND_BY_NAME';

  constructor(entityType: 'category' | 'subcategory', name: string) {
    super(EntityNotFoundByNameException.CODE, `${entityType} with name ${name} not found`);
  }
}
