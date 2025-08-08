import { DomainEventType } from '~shared/domain/enums/event-type.enum';
import { DomainEvent } from '~shared/domain/events/domain.event';

interface ICompanyLogoUploadRequestedEventPayload {
  companyId: string;
  logoFile: Express.Multer.File;
  userId: string;
}

export class CompanyLogoUploadRequestedEvent extends DomainEvent<ICompanyLogoUploadRequestedEventPayload> {
  public eventType: DomainEventType = DomainEventType.COMPANY_LOGO_UPLOAD_REQUESTED;
}
