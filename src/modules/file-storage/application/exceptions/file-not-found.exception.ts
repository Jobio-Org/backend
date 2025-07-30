export class FileNotFoundException extends Error {
  constructor(
    message: string,
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = 'FileNotFoundException';
  }
}
