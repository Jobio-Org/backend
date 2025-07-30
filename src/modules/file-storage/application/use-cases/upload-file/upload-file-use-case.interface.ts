import { type File } from '../../../domain/entities/file.entity';

export interface UploadFileInput {
  file: Express.Multer.File;
  bucket: string;
}

export type UploadFileOutput = File;

export interface IUploadFileUseCase {
  execute(input: UploadFileInput): Promise<UploadFileOutput>;
}
