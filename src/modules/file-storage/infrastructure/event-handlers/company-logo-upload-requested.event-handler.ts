import { Inject, Injectable } from '@nestjs/common';

import { EventsHandler, IEventHandler } from '~lib/nest-event-driven';

import { CompanyLogoUploadRequestedEvent } from '~modules/companies/domain/events/company-logo-upload-requested.event';
import { CompanyLogoUploadedEvent } from '~modules/companies/domain/events/company-logo-uploaded.event';
import { FileUploadException } from '~modules/file-storage/application/exceptions/file-upload.exception';
import { IFileStorageService } from '~modules/file-storage/application/services/file-storage.service';
import { FileStorageDiToken } from '~modules/file-storage/constants';
import { FileBucket } from '~modules/file-storage/domain/enums/file-type.enum';
import { ImageProcessingService } from '~modules/file-storage/infrastructure/services/image-processing/image-processing.service';

import { IEventDispatcher } from '~shared/application/events/event-dispatcher/event-dispatcher.interface';
import { BaseToken } from '~shared/constants';

@Injectable()
@EventsHandler(CompanyLogoUploadRequestedEvent)
export class CompanyLogoUploadRequestedEventHandler implements IEventHandler<CompanyLogoUploadRequestedEvent> {
  constructor(
    @Inject(FileStorageDiToken.FILE_STORAGE_SERVICE)
    private readonly fileStorageService: IFileStorageService,
    @Inject(BaseToken.EVENT_DISPATCHER)
    private readonly eventDispatcher: IEventDispatcher,
    @Inject(FileStorageDiToken.IMAGE_PROCESSING_SERVICE)
    private readonly imageProcessingService: ImageProcessingService,
  ) {}

  async handle(event: CompanyLogoUploadRequestedEvent): Promise<void> {
    try {
      const { companyId, logoFile, userId } = event.payload;

      if (!this.imageProcessingService.isImageFile(logoFile)) {
        throw new FileUploadException('Logo file must be an image');
      }

      const uploadedFile = await this.fileStorageService.uploadFileWithProcessing(logoFile, FileBucket.LOGOS);

      this.eventDispatcher.registerEvent(
        new CompanyLogoUploadedEvent({
          companyId,
          logoUrl: uploadedFile.url,
          userId,
        }),
      );

      this.eventDispatcher.dispatchEvents();
    } catch (error) {
      console.error('Failed to upload company logo:', error);
      throw error;
    }
  }
}
