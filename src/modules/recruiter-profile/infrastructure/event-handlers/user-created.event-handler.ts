import { Inject, Injectable } from '@nestjs/common';

import { EventsHandler } from '~lib/nest-event-driven';

import { ICreateRecruiterProfileUseCase } from '~modules/recruiter-profile/application/use-cases/create-recruiter-profile/create-recruiter-profile-use-case.interface';
import { RecruiterProfileDiToken } from '~modules/recruiter-profile/constants';
import { UserDetailsCreatedEvent } from '~modules/user-details/domain/events/user-details-created.event';

import { UserRole } from '~shared/domain/enums/user-role.enum';

@Injectable()
@EventsHandler(UserDetailsCreatedEvent)
export class UserDetailsCreatedEventHandler {
  constructor(
    @Inject(RecruiterProfileDiToken.CREATE_RECRUITER_PROFILE_USE_CASE)
    private readonly createRecruiterProfileUseCase: ICreateRecruiterProfileUseCase,
  ) {}

  async handle(event: UserDetailsCreatedEvent): Promise<void> {
    const { role, userDetails } = event.payload;

    if (role !== UserRole.RECRUITER) {
      return;
    }

    await this.createRecruiterProfileUseCase.execute({
      userDetailsId: userDetails.id,
    });
  }
}
