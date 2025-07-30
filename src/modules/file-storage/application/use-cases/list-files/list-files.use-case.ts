import { Inject, Injectable } from '@nestjs/common';

import { Query } from '~shared/application/CQS/query.abstract';

import { FileStorageDiToken } from '../../../constants';
import { FileBucket } from '../../../domain/enums/file-type.enum';
import { IFileRepository } from '../../../domain/repositories/file-repository.interface';
import { IListFilesUseCase, type ListFilesInput, type ListFilesOutput } from './list-files-use-case.interface';

@Injectable()
export class ListFilesUseCase extends Query<ListFilesInput, ListFilesOutput> implements IListFilesUseCase {
  constructor(
    @Inject(FileStorageDiToken.FILE_REPOSITORY)
    private readonly fileRepository: IFileRepository,
  ) {
    super();
  }

  protected async implementation(): Promise<ListFilesOutput> {
    const { bucket } = this._input;

    if (bucket) {
      return await this.fileRepository.findByBucket(bucket as FileBucket);
    }

    // Якщо bucket не вказано, повертаємо всі файли
    // Це може бути небезпечно для великих даних, але поки що залишаємо
    const allFiles = await this.fileRepository.findAll();
    return allFiles;
  }
}
