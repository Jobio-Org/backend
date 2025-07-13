import { NotFoundException } from '~core/exceptions/domain/exceptions/not-found-exception/not-found.exception';

export class EntityNotFoundByIdException extends NotFoundException {
  public static readonly CODE = 'ENTITY_NOT_FOUND_BY_ID';

  constructor(entityType: 'category' | 'subcategory', id: string) {
    super(EntityNotFoundByIdException.CODE, `${entityType} with id ${id} not found`);
  }
}
