import { Module } from '@nestjs/common';

import { DeleteFileUseCase } from './application/use-cases/delete-file/delete-file.use-case';
import { GetFileUrlUseCase } from './application/use-cases/get-file-url/get-file-url.use-case';
import { ListFilesUseCase } from './application/use-cases/list-files/list-files.use-case';
import { UploadFileUseCase } from './application/use-cases/upload-file/upload-file.use-case';
import { FileStorageDiToken } from './constants';
import { FileMapper } from './domain/mappers/file/file.mapper';
import { FileStorageController } from './infrastructure/controllers/file-storage.controller';
import { FileDeletedEventHandler } from './infrastructure/event-handlers/file-deleted.event-handler';
import { FileUploadedEventHandler } from './infrastructure/event-handlers/file-uploaded.event-handler';
import { DrizzleFileRepository } from './infrastructure/persistence/drizzle/repositories/drizzle-file.repository';
import { SupabaseStorageService } from './infrastructure/services/supabase/supabase-storage.service';

@Module({
  providers: [
    {
      provide: FileStorageDiToken.UPLOAD_FILE_USE_CASE,
      useClass: UploadFileUseCase,
    },
    {
      provide: FileStorageDiToken.DELETE_FILE_USE_CASE,
      useClass: DeleteFileUseCase,
    },
    {
      provide: FileStorageDiToken.GET_FILE_URL_USE_CASE,
      useClass: GetFileUrlUseCase,
    },
    {
      provide: FileStorageDiToken.LIST_FILES_USE_CASE,
      useClass: ListFilesUseCase,
    },
    {
      provide: FileStorageDiToken.FILE_STORAGE_SERVICE,
      useClass: SupabaseStorageService,
    },
    {
      provide: FileStorageDiToken.FILE_REPOSITORY,
      useClass: DrizzleFileRepository,
    },
    FileMapper,
    FileUploadedEventHandler,
    FileDeletedEventHandler,
  ],
  controllers: [FileStorageController],
  exports: [FileStorageDiToken.FILE_STORAGE_SERVICE, FileStorageDiToken.FILE_REPOSITORY],
})
export class FileStorageModule {}
