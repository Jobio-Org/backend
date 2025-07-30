import { type IEvent } from '~lib/nest-event-driven/interfaces';

import { type File } from '../entities/file.entity';

export class FileUploadedEvent implements IEvent {
  public readonly eventType = 'file.uploaded';
  public readonly payload: Readonly<{
    file: File;
  }>;
  constructor(public readonly file: File) {
    this.payload = { file };
  }
}
