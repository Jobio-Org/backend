import { type User } from '~modules/auth/domain/entities/user.entity';
import { type UserDetails } from '~modules/user-details/domain/entities/user-details.entity';

import { DomainEventType } from '~shared/domain/enums/event-type.enum';
import { type UserRole } from '~shared/domain/enums/user-role.enum';
import { DomainEvent } from '~shared/domain/events/domain.event';

export interface IUserDetailsEventPayload {
  user: User;
  role: UserRole;
  userDetails: UserDetails;
}

export class UserDetailsEvent<
  TPayload extends IUserDetailsEventPayload = IUserDetailsEventPayload,
> extends DomainEvent<TPayload> {
  public eventType: DomainEventType = DomainEventType.USER_DETAILS;
}
