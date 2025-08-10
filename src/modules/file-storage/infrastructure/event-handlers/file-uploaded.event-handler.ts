import { Injectable } from '@nestjs/common';

import { EventsHandler } from '~lib/nest-event-driven';

import { FileUploadedEvent } from '../../domain/events/file-uploaded.event';

@Injectable()
@EventsHandler(FileUploadedEvent)
export class FileUploadedEventHandler {
  async handle(event: FileUploadedEvent): Promise<void> {
    // TODO: Implement event handling logic
    // Examples:
    // - Send notification to user
    // - Update file metadata
    // - Log file upload activity

    console.log(`File uploaded: ${event.file.name}`);
  }
}
