import { Builder } from 'builder-pattern';

import { type FileBucket, FileType } from '../enums/file-type.enum';
import { type FilePath } from '../value-objects/file-path.value-object';

export class File {
  public readonly id: string;
  public readonly name: string;
  public readonly originalName: string;
  public readonly path: FilePath;
  public readonly mimeType: string;
  public readonly type: FileType;
  public readonly bucket: FileBucket;
  public readonly url?: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public static builder(name: string, originalName: string, path: FilePath, mimeType: string, bucket: FileBucket) {
    return Builder(File, {
      name,
      originalName,
      path,
      mimeType,
      bucket,
      type: File.getFileType(mimeType),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  private static getFileType(mimeType: string): FileType {
    if (mimeType.startsWith('image/')) {
      return FileType.IMAGE;
    }
    if (mimeType.startsWith('video/')) {
      return FileType.VIDEO;
    }
    if (mimeType.startsWith('audio/')) {
      return FileType.AUDIO;
    }
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text/')) {
      return FileType.DOCUMENT;
    }
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar') || mimeType.includes('7z')) {
      return FileType.ARCHIVE;
    }
    return FileType.OTHER;
  }
}
