export class FilePath {
  private constructor(private readonly value: string) {}

  public static create(path: string): FilePath {
    if (!path || path.trim().length === 0) {
      throw new Error('File path cannot be empty');
    }

    // Remove leading and trailing slashes
    const normalizedPath = path.replace(/^\/+|\/+$/g, '');

    if (normalizedPath.length === 0) {
      throw new Error('File path cannot be empty after normalization');
    }

    return new FilePath(normalizedPath);
  }

  public getValue(): string {
    return this.value;
  }

  public toString(): string {
    return this.value;
  }

  public equals(other: FilePath): boolean {
    return this.value === other.value;
  }
}
