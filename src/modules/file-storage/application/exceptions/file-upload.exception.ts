import { CustomException } from '~core/exceptions/domain/exceptions/custom-exception/dynamic.exception';

export class FileUploadException extends CustomException {
  public static readonly CODE = 'FILE_UPLOAD_EXCEPTION';

  constructor(message: string, cause?: unknown) {
    super(FileUploadException.CODE, message, cause);
  }
}
