import { Inject, Injectable } from '@nestjs/common';

import { ICandidateProfileQueryService } from '~modules/candidate-profile/application/services/candidate-profile-query-service.interface';
import { CandidateProfileDiToken } from '~modules/candidate-profile/constants';
import { CandidateProfile } from '~modules/candidate-profile/domain/entities/candidate-profile.entity';
import { ICandidateProfileRepository } from '~modules/candidate-profile/domain/repositories/candidate-profile-repository.interface';
import { IGetUserDetailsByIdUseCase } from '~modules/user-details/application/use-cases/get-user-details-by-id/get-user-details-by-id-use-case.interface';
import { UserDetailsDiToken } from '~modules/user-details/constants';

@Injectable()
export class CandidateProfileQueryService implements ICandidateProfileQueryService {
  constructor(
    @Inject(CandidateProfileDiToken.CANDIDATE_PROFILE_REPOSITORY)
    private readonly candidateProfileRepository: ICandidateProfileRepository,
    @Inject(UserDetailsDiToken.GET_USER_DETAILS_BY_ID_USE_CASE)
    private readonly getUserDetailsByIdUseCase: IGetUserDetailsByIdUseCase,
  ) {}

  async getCandidateProfileByUserDetailsId(userId: string): Promise<CandidateProfile | null> {
    const userDetails = await this.getUserDetailsByIdUseCase.execute({ userId });

    if (!userDetails) {
      return null;
    }

    return this.candidateProfileRepository.findByUserDetailsId(userDetails.id);
  }
}
