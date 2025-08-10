import { type File } from '~modules/file-storage/domain/entities/file.entity';
import { type FileBucket } from '~modules/file-storage/domain/enums/file-type.enum';
import { type ImageProcessingOptions } from '~modules/file-storage/infrastructure/services/image-processing/image-processing.service';

export interface IFileStorageService {
  uploadFile(file: Express.Multer.File, bucket: FileBucket): Promise<File>;

  uploadFileWithProcessing(
    file: Express.Multer.File,
    bucket: FileBucket,
    processingOptions?: ImageProcessingOptions,
  ): Promise<File>;

  deleteFile(fileId: string): Promise<void>;

  getFileUrl(fileId: string, expiresIn?: number): Promise<string>;
}
