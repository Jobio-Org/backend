import { Inject, Injectable } from '@nestjs/common';

import { EventsHandler } from '~lib/nest-event-driven';

import { UserCreatedEvent } from '~modules/auth/domain/events/user-created.event';
import { ICreateUserDetailsUseCase } from '~modules/user-details/application/use-cases/create-user-details/create-user-details-use-case.interface';
import { IGetUserDetailsByIdUseCase } from '~modules/user-details/application/use-cases/get-user-details-by-id/get-user-details-by-id-use-case.interface';
import { UserDetailsDiToken } from '~modules/user-details/constants';
import { UserDetailsCreatedEvent } from '~modules/user-details/domain/events/user-details-created.event';

import { IEventDispatcher } from '~shared/application/events/event-dispatcher/event-dispatcher.interface';
import { BaseToken } from '~shared/constants';

@Injectable()
@EventsHandler(UserCreatedEvent)
export class UserCreatedEventHandler {
  constructor(
    @Inject(UserDetailsDiToken.CREATE_USER_DETAILS_USE_CASE)
    private readonly createUserDetailsUseCase: ICreateUserDetailsUseCase,
    @Inject(UserDetailsDiToken.GET_USER_DETAILS_BY_ID_USE_CASE)
    private readonly getUserDetailsByIdUseCase: IGetUserDetailsByIdUseCase,
    @Inject(BaseToken.EVENT_DISPATCHER)
    private readonly eventDispatcher: IEventDispatcher,
  ) {}

  async handle(event: UserCreatedEvent): Promise<void> {
    const { user, role } = event.payload;

    await this.createUserDetailsUseCase.execute({
      userId: user.id,
      role,
    });

    const userDetails = await this.getUserDetailsByIdUseCase.execute({ userId: user.id });

    if (!userDetails) {
      throw new Error('Failed to create user details');
    }

    this.eventDispatcher.registerEvent(
      new UserDetailsCreatedEvent({
        user,
        role,
        userDetails,
      }),
    );

    // Dispatch events immediately since we not using Command here
    this.eventDispatcher.dispatchEvents();
  }
}
