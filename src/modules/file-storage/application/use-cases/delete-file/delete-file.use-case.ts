import { Inject, Injectable } from '@nestjs/common';

import { Command } from '~shared/application/CQS/command.abstract';

import { DeleteFileDto } from '../../../application/dto/delete-file.dto';
import { FileDeleteException } from '../../../application/exceptions/file-delete.exception';
import { FileNotFoundException } from '../../../application/exceptions/file-not-found.exception';
import { IFileStorageService } from '../../../application/services/file-storage.service';
import { FileStorageDiToken } from '../../../constants';
import { IFileRepository } from '../../../domain/repositories/file-repository.interface';
import { IDeleteFileUseCase } from './delete-file-use-case.interface';

@Injectable()
export class DeleteFileUseCase extends Command<DeleteFileDto, void> implements IDeleteFileUseCase {
  constructor(
    @Inject(FileStorageDiToken.FILE_STORAGE_SERVICE)
    private readonly fileStorageService: IFileStorageService,
    @Inject(FileStorageDiToken.FILE_REPOSITORY)
    private readonly fileRepository: IFileRepository,
  ) {
    super();
  }

  protected async implementation(): Promise<void> {
    try {
      const { fileId } = this._input;

      // Check if file exists
      const file = await this.fileRepository.findById(fileId);
      if (!file) {
        throw new FileNotFoundException(`File with ID ${fileId} not found`);
      }

      // Delete from storage and database (SupabaseStorageService handles both)
      await this.fileStorageService.deleteFile(fileId);
    } catch (error) {
      if (error instanceof FileNotFoundException) {
        throw error;
      }
      throw new FileDeleteException(`Failed to delete file: ${error.message}`, error);
    }
  }
}
