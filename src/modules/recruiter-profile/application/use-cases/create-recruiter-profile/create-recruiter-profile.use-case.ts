import { Inject, Injectable } from '@nestjs/common';

import { CreateRecruiterProfileDto } from '~modules/recruiter-profile/application/dto/create-recruiter-profile.dto';
import { ICreateRecruiterProfileUseCase } from '~modules/recruiter-profile/application/use-cases/create-recruiter-profile/create-recruiter-profile-use-case.interface';
import { RecruiterProfileDiToken } from '~modules/recruiter-profile/constants';
import { RecruiterProfile } from '~modules/recruiter-profile/domain/entities/recruiter-profile.entity';
import { RecruiterProfileCreatedEvent } from '~modules/recruiter-profile/domain/events/recruiter-profile-created.event';
import { IRecruiterProfileRepository } from '~modules/recruiter-profile/domain/repositories/recruiter-profile-repository.interface';

import { Command } from '~shared/application/CQS/command.abstract';

@Injectable()
export class CreateRecruiterProfileUseCase
  extends Command<CreateRecruiterProfileDto, void>
  implements ICreateRecruiterProfileUseCase
{
  constructor(
    @Inject(RecruiterProfileDiToken.RECRUITER_PROFILE_REPOSITORY)
    private readonly recruiterProfileRepository: IRecruiterProfileRepository,
  ) {
    super();
  }

  protected async implementation(): Promise<void> {
    const { userDetailsId } = this._input;

    const recruiterProfile = RecruiterProfile.builder(userDetailsId).build();
    const savedRecruiterProfile = await this.recruiterProfileRepository.create(recruiterProfile);

    this._eventDispatcher.registerEvent(
      new RecruiterProfileCreatedEvent({
        recruiterProfileId: savedRecruiterProfile.id,
      }),
    );
  }
}
