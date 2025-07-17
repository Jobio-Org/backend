import { DomainEventType } from '~shared/domain/enums/event-type.enum';
import { DomainEvent } from '~shared/domain/events/domain.event';

export interface CompanyInvitationSentPayload {
  email: string;
  link: string;
  message?: string;
  companyName?: string;
  inviterName?: string;
}

export class CompanyInvitationSentEvent extends DomainEvent<CompanyInvitationSentPayload> {
  public readonly eventType = DomainEventType.COMPANY_INVITATION_SENT;
  constructor(payload: CompanyInvitationSentPayload) {
    super(payload);
  }
}
