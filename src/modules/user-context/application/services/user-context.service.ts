import { Inject, Injectable } from '@nestjs/common';

import { ICandidateProfileQueryService } from '~modules/candidate-profile/application/services/candidate-profile-query-service.interface';
import { CandidateProfileDiToken } from '~modules/candidate-profile/constants';
import { CandidateProfile } from '~modules/candidate-profile/domain/entities/candidate-profile.entity';
import { IRecruiterProfileQueryService } from '~modules/recruiter-profile/application/services/recruiter-profile-query-service.interface';
import { RecruiterProfileDiToken } from '~modules/recruiter-profile/constants';
import { RecruiterProfile } from '~modules/recruiter-profile/domain/entities/recruiter-profile.entity';
import { IGetUserDetailsByIdUseCase } from '~modules/user-details/application/use-cases/get-user-details-by-id/get-user-details-by-id-use-case.interface';
import { UserDetailsDiToken } from '~modules/user-details/constants';
import { UserDetails } from '~modules/user-details/domain/entities/user-details.entity';

import { UserRole } from '~shared/domain/enums/user-role.enum';

export interface UserContextData {
  userDetails: UserDetails;
  profile: CandidateProfile | RecruiterProfile | null;
}

@Injectable()
export class UserContextService {
  constructor(
    @Inject(UserDetailsDiToken.GET_USER_DETAILS_BY_ID_USE_CASE)
    private readonly getUserDetailsByIdUseCase: IGetUserDetailsByIdUseCase,
    @Inject(CandidateProfileDiToken.CANDIDATE_PROFILE_QUERY_SERVICE)
    private readonly candidateProfileQueryService: ICandidateProfileQueryService,
    @Inject(RecruiterProfileDiToken.RECRUITER_PROFILE_QUERY_SERVICE)
    private readonly recruiterProfileQueryService: IRecruiterProfileQueryService,
  ) {}

  async getUserContext(userId: string): Promise<UserContextData> {
    const userDetails = await this.getUserDetailsByIdUseCase.execute({ userId });

    if (!userDetails) {
      throw new Error('User details not found');
    }

    let profile: CandidateProfile | RecruiterProfile | null = null;

    switch (userDetails.role) {
      case UserRole.CANDIDATE:
        profile = await this.candidateProfileQueryService.getCandidateProfileWithUserDetails(userDetails.id);
        break;
      case UserRole.RECRUITER:
        profile = await this.recruiterProfileQueryService.getRecruiterProfileWithActiveCompany(userDetails.id);
        break;
      default:
        throw new Error('Invalid user role');
    }

    return {
      userDetails,
      profile,
    };
  }
}
