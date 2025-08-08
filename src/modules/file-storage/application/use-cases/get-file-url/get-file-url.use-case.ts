import { Inject, Injectable } from '@nestjs/common';

import { GetFileUrlDto } from '~modules/file-storage/application/dto/get-file-url.dto';
import { FileNotFoundException } from '~modules/file-storage/application/exceptions/file-not-found.exception';
import { IFileStorageService } from '~modules/file-storage/application/services/file-storage.service';
import { IGetFileUrlUseCase } from '~modules/file-storage/application/use-cases/get-file-url/get-file-url-use-case.interface';
import { FileStorageDiToken } from '~modules/file-storage/constants';
import { IFileRepository } from '~modules/file-storage/domain/repositories/file-repository.interface';

import { Query } from '~shared/application/CQS/query.abstract';

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

    const file = await this.fileRepository.findById(fileId);

    if (!file) {
      throw new FileNotFoundException(fileId);
    }

    return await this.fileStorageService.getFileUrl(fileId, expiresIn);
  }
}
