import { Inject, Injectable } from '@nestjs/common';

import { Query } from '~shared/application/CQS/query.abstract';

import { GetFileUrlDto } from '../../../application/dto/get-file-url.dto';
import { FileNotFoundException } from '../../../application/exceptions/file-not-found.exception';
import { IFileStorageService } from '../../../application/services/file-storage.service';
import { FileStorageDiToken } from '../../../constants';
import { IFileRepository } from '../../../domain/repositories/file-repository.interface';
import { IGetFileUrlUseCase } from './get-file-url-use-case.interface';

@Injectable()
export class GetFileUrlUseCase extends Query<GetFileUrlDto, string> implements IGetFileUrlUseCase {
  constructor(
    @Inject(FileStorageDiToken.FILE_STORAGE_SERVICE)
    private readonly fileStorageService: IFileStorageService,
    @Inject(FileStorageDiToken.FILE_REPOSITORY)
    private readonly fileRepository: IFileRepository,
  ) {
    super();
  }

  protected async implementation(): Promise<string> {
    const { fileId, expiresIn } = this._input;

    // Check if file exists
    const file = await this.fileRepository.findById(fileId);
    if (!file) {
      throw new FileNotFoundException(`File with ID ${fileId} not found`);
    }

    // Get file URL from storage
    return await this.fileStorageService.getFileUrl(fileId, expiresIn);
  }
}
