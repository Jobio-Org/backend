import { type File } from '~modules/file-storage/domain/entities/file.entity';

import { type IUseCase } from '~shared/application/use-cases/use-case.interface';

export interface UploadFileInput {
  file: Express.Multer.File;
  bucket: string;
}

export type UploadFileOutput = File;

export interface IUploadFileUseCase extends IUseCase<UploadFileInput, UploadFileOutput> {
  execute(input: UploadFileInput): Promise<UploadFileOutput>;
}
