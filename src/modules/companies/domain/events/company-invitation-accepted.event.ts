import { DomainEventType } from '~shared/domain/enums/event-type.enum';
import { DomainEvent } from '~shared/domain/events/domain.event';

export interface CompanyInvitationAcceptedEventPayload {
  invitationId: string;
  companyId: string;
  recruiterProfileId: string;
  email: string;
}

export class CompanyInvitationAcceptedEvent extends DomainEvent<CompanyInvitationAcceptedEventPayload> {
  public readonly eventType = DomainEventType.COMPANY_INVITATION_ACCEPTED;
  constructor(payload: CompanyInvitationAcceptedEventPayload) {
    super(payload);
  }
}
