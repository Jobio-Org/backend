import { Inject, Injectable } from '@nestjs/common';

import { FileUploadException } from '~modules/file-storage/application/exceptions/file-upload.exception';
import { IFileStorageService } from '~modules/file-storage/application/services/file-storage.service';
import {
  type IUploadFileUseCase,
  type UploadFileInput,
  type UploadFileOutput,
} from '~modules/file-storage/application/use-cases/upload-file/upload-file-use-case.interface';
import { FileStorageDiToken } from '~modules/file-storage/constants';
import { FileBucket } from '~modules/file-storage/domain/enums/file-type.enum';

import { Command } from '~shared/application/CQS/command.abstract';

@Injectable()
export class UploadFileUseCase extends Command<UploadFileInput, UploadFileOutput> implements IUploadFileUseCase {
  constructor(
    @Inject(FileStorageDiToken.FILE_STORAGE_SERVICE)
    private readonly fileStorageService: IFileStorageService,
  ) {
    super();
  }

  protected async implementation(): Promise<UploadFileOutput> {
    try {
      const { file, bucket } = this._input;

      if (!file) {
        throw new FileUploadException('No file provided');
      }

      const savedFile = await this.fileStorageService.uploadFile(file, bucket as FileBucket);

      return savedFile;
    } catch (error) {
      throw new FileUploadException(`Failed to upload file: ${error.message}`, error);
    }
  }
}
