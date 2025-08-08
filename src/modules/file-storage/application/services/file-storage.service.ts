import { type File } from '~modules/file-storage/domain/entities/file.entity';
import { type FileBucket } from '~modules/file-storage/domain/enums/file-type.enum';

export interface IFileStorageService {
  uploadFile(file: Express.Multer.File, bucket: FileBucket): Promise<File>;

  deleteFile(fileId: string): Promise<void>;

  getFileUrl(fileId: string, expiresIn?: number): Promise<string>;
}
