import { DomainEventType } from '~shared/domain/enums/event-type.enum';
import { DomainEvent } from '~shared/domain/events/domain.event';

interface ICompanyLogoUploadedEventPayload {
  companyId: string;
  logoUrl: string;
  userId: string;
}

export class CompanyLogoUploadedEvent extends DomainEvent<ICompanyLogoUploadedEventPayload> {
  public eventType: DomainEventType = DomainEventType.COMPANY_LOGO_UPLOADED;
}
