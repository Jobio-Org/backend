import { File } from '~modules/file-storage/domain/entities/file.entity';
import { type FileBucket, type FileType } from '~modules/file-storage/domain/enums/file-type.enum';
import { FilePath } from '~modules/file-storage/domain/value-objects/file-path.value-object';

import { type IDataAccessMapper } from '~shared/domain/mappers';

export interface IFileDataAccess {
  id: string;
  name: string;
  originalName: string;
  path: string;
  mimeType: string;
  type: string;
  bucket: string;
  url: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class FileMapper implements IDataAccessMapper<File, IFileDataAccess> {
  toDomain(data: IFileDataAccess): File {
    return File.builder(
      data.name,
      data.originalName,
      FilePath.create(data.path),
      data.mimeType,
      data.bucket as FileBucket,
    )
      .id(data.id)
      .url(data.url ?? undefined)
      .type(data.type as FileType)
      .createdAt(data.createdAt)
      .updatedAt(data.updatedAt)
      .build();
  }

  toPersistence(domain: File): IFileDataAccess {
    return {
      id: domain.id,
      name: domain.name,
      originalName: domain.originalName,
      path: domain.path.getValue(),
      mimeType: domain.mimeType,
      type: domain.type,
      bucket: domain.bucket,
      url: domain.url ?? null,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }
}
