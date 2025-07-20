import { Inject, Injectable } from '@nestjs/common';

import { IGetRecruiterProfileByEmailUseCase } from '~modules/recruiter-profile/application/use-cases/get-recruiter-profile-by-email/get-recruiter-profile-by-email-use-case.interface';
import { RecruiterProfileDiToken } from '~modules/recruiter-profile/constants';
import { RecruiterProfile } from '~modules/recruiter-profile/domain/entities/recruiter-profile.entity';
import { IRecruiterProfileRepository } from '~modules/recruiter-profile/domain/repositories/recruiter-profile-repository.interface';
import { UserDetailsDiToken } from '~modules/user-details/constants';
import { IUserDetailsRepository } from '~modules/user-details/domain/repositories/user-details-repository.interface';

import { Query } from '~shared/application/CQS/query.abstract';

@Injectable()
export class GetRecruiterProfileByEmailUseCase
  extends Query<{ email: string }, RecruiterProfile | null>
  implements IGetRecruiterProfileByEmailUseCase
{
  constructor(
    @Inject(RecruiterProfileDiToken.RECRUITER_PROFILE_REPOSITORY)
    private readonly recruiterProfileRepository: IRecruiterProfileRepository,
    @Inject(UserDetailsDiToken.USER_DETAILS_REPOSITORY)
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
