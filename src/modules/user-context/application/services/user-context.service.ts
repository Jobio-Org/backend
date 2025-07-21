import { Inject, Injectable } from '@nestjs/common';

import { ICandidateProfileQueryService } from '~modules/candidate-profile/application/services/candidate-profile-query-service.interface';
import { CandidateProfileDiToken } from '~modules/candidate-profile/constants';
import { CandidateProfile } from '~modules/candidate-profile/domain/entities/candidate-profile.entity';
import { IRecruiterProfileQueryService } from '~modules/recruiter-profile/application/services/recruiter-profile-query-service.interface';
import { RecruiterProfileDiToken } from '~modules/recruiter-profile/constants';
import { RecruiterProfile } from '~modules/recruiter-profile/domain/entities/recruiter-profile.entity';
import { UserContextDto } from '~modules/user-context/application/dto/user-context.dto';
import { InvalidUserRoleException } from '~modules/user-context/application/exceptions/invalid-user-role.exception';
import { UserDetailsNotFoundException } from '~modules/user-context/application/exceptions/user-details-not-found.exception';
import { IUserContextService } from '~modules/user-context/application/services/user-context-service.interface';
import { IGetUserDetailsByIdUseCase } from '~modules/user-details/application/use-cases/get-user-details-by-id/get-user-details-by-id-use-case.interface';
import { UserDetailsDiToken } from '~modules/user-details/constants';

import { UserRole } from '~shared/domain/enums/user-role.enum';

@Injectable()
export class UserContextService implements IUserContextService {
  constructor(
    @Inject(UserDetailsDiToken.GET_USER_DETAILS_BY_ID_USE_CASE)
    private readonly getUserDetailsByIdUseCase: IGetUserDetailsByIdUseCase,
    @Inject(CandidateProfileDiToken.CANDIDATE_PROFILE_QUERY_SERVICE)
    private readonly candidateProfileQueryService: ICandidateProfileQueryService,
    @Inject(RecruiterProfileDiToken.RECRUITER_PROFILE_QUERY_SERVICE)
    private readonly recruiterProfileQueryService: IRecruiterProfileQueryService,
  ) {}

  async getUserContext(userId: string): Promise<UserContextDto> {
    const userDetails = await this.getUserDetailsByIdUseCase.execute({ userId });

    if (!userDetails) {
      throw new UserDetailsNotFoundException(userId);
    }

    let profile: CandidateProfile | RecruiterProfile | null = null;

    switch (userDetails.role) {
      case UserRole.CANDIDATE:
        profile = await this.candidateProfileQueryService.getCandidateProfileByUserDetailsId(userDetails.id);
        break;
      case UserRole.RECRUITER:
        profile = await this.recruiterProfileQueryService.getRecruiterProfileByUserDetailsId(userDetails.id);
        break;
      default:
        throw new InvalidUserRoleException(userDetails.role);
    }

    const userContextDto = UserContextDto.builder()
      .id(userDetails.id)
      .userId(userDetails.userId)
      .fullName(userDetails.fullName)
      .role(userDetails.role)
      .createdAt(userDetails.createdAt)
      .updatedAt(userDetails.updatedAt)
      .profile(profile)
      .build();

    return userContextDto;
  }
}
