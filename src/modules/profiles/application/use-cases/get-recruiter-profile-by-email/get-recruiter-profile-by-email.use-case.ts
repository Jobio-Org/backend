import { Inject, Injectable } from '@nestjs/common';

import { IGetRecruiterProfileByEmailUseCase } from '~modules/profiles/application/use-cases/get-recruiter-profile-by-email/get-recruiter-profile-by-email-use-case.interface';
import { ProfilesDiToken } from '~modules/profiles/constants';
import { RecruiterProfile } from '~modules/profiles/domain/entities/recruiter-profile.entity';
import { IRecruiterProfileRepository } from '~modules/profiles/domain/repositories/recruiter-profile-repository.interface';
import { IUserDetailsRepository } from '~modules/profiles/domain/repositories/user-details-repository.interface';

import { Query } from '~shared/application/CQS/query.abstract';

@Injectable()
export class GetRecruiterProfileByEmailUseCase
  extends Query<{ email: string }, RecruiterProfile | null>
  implements IGetRecruiterProfileByEmailUseCase
{
  constructor(
    @Inject(ProfilesDiToken.RECRUITER_PROFILE_REPOSITORY)
    private readonly recruiterProfileRepository: IRecruiterProfileRepository,
    @Inject(ProfilesDiToken.USER_DETAILS_REPOSITORY)
    private readonly userDetailsRepository: IUserDetailsRepository,
  ) {
    super();
  }

  protected async implementation(): Promise<RecruiterProfile | null> {
    const { email } = this._input;
    const userDetails = await this.userDetailsRepository.findByEmail(email);

    if (!userDetails) return null;

    return this.recruiterProfileRepository.findByUserDetailsId(userDetails.id);
  }
}
