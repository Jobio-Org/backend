import { Inject, Injectable } from '@nestjs/common';

import { EventsHandler } from '~lib/nest-event-driven';

import { ICreateCandidateProfileUseCase } from '~modules/candidate-profile/application/use-cases/create-candidate-profile/create-candidate-profile-use-case.interface';
import { CandidateProfileDiToken } from '~modules/candidate-profile/constants';
import { UserDetailsCreatedEvent } from '~modules/user-details/domain/events/user-details-created.event';

import { UserRole } from '~shared/domain/enums/user-role.enum';

@Injectable()
@EventsHandler(UserDetailsCreatedEvent)
export class UserDetailsCreatedEventHandler {
  constructor(
    @Inject(CandidateProfileDiToken.CREATE_CANDIDATE_PROFILE_USE_CASE)
    private readonly createCandidateProfileUseCase: ICreateCandidateProfileUseCase,
  ) {}

  async handle(event: UserDetailsCreatedEvent): Promise<void> {
    const { role, userDetails } = event.payload;

    if (role !== UserRole.CANDIDATE) {
      return;
    }

    await this.createCandidateProfileUseCase.execute({
      userDetailsId: userDetails.id,
    });
  }
}
