import { UserDetailsEvent } from '~modules/user-details/domain/events/user-details.event';

import { DomainEventType } from '~shared/domain/enums/event-type.enum';

export class UserDetailsCreatedEvent extends UserDetailsEvent {
  public eventType: DomainEventType = DomainEventType.USER_DETAILS_CREATED;
}
