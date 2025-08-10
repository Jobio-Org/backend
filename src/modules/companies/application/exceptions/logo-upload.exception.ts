import { HttpException, HttpStatus } from '@nestjs/common';

export class LogoUploadException extends HttpException {
  constructor(message: string, cause?: Error) {
    super(
      {
        message,
        error: 'Logo Upload Error',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
    this.cause = cause;
  }
}
