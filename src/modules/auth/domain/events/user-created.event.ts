import { UserEvent } from '~modules/auth/domain/events/user.event';

import { DomainEventType } from '~shared/domain/enums/event-type.enum';

export class UserCreatedEvent extends UserEvent {
  public eventType: DomainEventType = DomainEventType.USER_CREATED;
}
