import { NotFoundException } from '~core/exceptions/domain/exceptions/not-found-exception/not-found.exception';

export class FileNotFoundException extends NotFoundException {
  public static readonly CODE = 'FILE_NOT_FOUND';

  constructor(id: string, message?: string) {
    super(FileNotFoundException.CODE, message ?? `File with ID ${id} not found`);
  }
}
