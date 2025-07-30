import { Injectable } from '@nestjs/common';

import { EventsHandler } from '~lib/nest-event-driven';

import { FileDeletedEvent } from '../../domain/events/file-deleted.event';

@Injectable()
@EventsHandler(FileDeletedEvent)
export class FileDeletedEventHandler {
  async handle(event: FileDeletedEvent): Promise<void> {
    // TODO: Implement event handling logic
    // Examples:
    // - Send notification to user
    // - Log file deletion activity
    // - Update related entities
    // - Clean up related data

    console.log(`File deleted: ${event.file.name}`);
  }
}
