import { Module } from '@nestjs/common';

import { GetFileUrlUseCase } from '~modules/file-storage/application/use-cases/get-file-url/get-file-url.use-case';
import { FileStorageDiToken } from '~modules/file-storage/constants';
import { FileMapper } from '~modules/file-storage/domain/mappers/file/file.mapper';
import { FileStorageController } from '~modules/file-storage/infrastructure/controllers/file-storage.controller';
import { CompanyLogoUploadRequestedEventHandler } from '~modules/file-storage/infrastructure/event-handlers/company-logo-upload-requested.event-handler';
import { FileUploadedEventHandler } from '~modules/file-storage/infrastructure/event-handlers/file-uploaded.event-handler';
import { DrizzleFileRepository } from '~modules/file-storage/infrastructure/persistence/drizzle/repositories/drizzle-file.repository';
import { ImageProcessingService } from '~modules/file-storage/infrastructure/services/image-processing/image-processing.service';
import { SupabaseStorageService } from '~modules/file-storage/infrastructure/services/supabase/supabase-storage.service';

@Module({
  providers: [
    {
      provide: FileStorageDiToken.GET_FILE_URL_USE_CASE,
      useClass: GetFileUrlUseCase,
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
    CompanyLogoUploadRequestedEventHandler,
    {
      provide: FileStorageDiToken.IMAGE_PROCESSING_SERVICE,
      useClass: ImageProcessingService,
    },
  ],
  controllers: [FileStorageController],
  exports: [FileStorageDiToken.FILE_STORAGE_SERVICE, FileStorageDiToken.IMAGE_PROCESSING_SERVICE],
})
export class FileStorageModule {}
