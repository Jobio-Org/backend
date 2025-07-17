import { Inject, Injectable, forwardRef } from '@nestjs/common';

import { SupabaseUserMapper } from '~modules/auth/infrastructure/supabase/mappers/user/supabase-user.mapper';
import { SupabaseClientService } from '~modules/auth/infrastructure/supabase/services/supabase-client/supabase-client.service';
import { ICompaniesQueryService } from '~modules/companies/application/services/companies/companies-query-service.interface';
import { CompaniesDiToken } from '~modules/companies/constants';
import {
  type IGetUserProfileWithAuthUseCase,
  type IUserWithDetails,
} from '~modules/profiles/application/use-cases/get-user-profile-with-auth/get-user-profile-with-auth-use-case.interface';
import { ProfilesDiToken } from '~modules/profiles/constants';
import { CandidateProfile } from '~modules/profiles/domain/entities/candidate-profile.entity';
import { RecruiterProfile } from '~modules/profiles/domain/entities/recruiter-profile.entity';
import { ICandidateProfileRepository } from '~modules/profiles/domain/repositories/candidate-profile-repository.interface';
import { IRecruiterProfileRepository } from '~modules/profiles/domain/repositories/recruiter-profile-repository.interface';
import { type IUserDetailsRepository } from '~modules/profiles/domain/repositories/user-details-repository.interface';

import { Query } from '~shared/application/CQS/query.abstract';
import { UserRole } from '~shared/domain/enums/user-role.enum';

@Injectable()
export class GetUserProfileWithAuthUseCase
  extends Query<
    { userId: string; accessToken: string },
    {
      user: IUserWithDetails;
      profile: CandidateProfile | RecruiterProfile | null;
    }
  >
  implements IGetUserProfileWithAuthUseCase
{
  constructor(
    @Inject(ProfilesDiToken.USER_DETAILS_REPOSITORY)
    private readonly userDetailsRepository: IUserDetailsRepository,
    @Inject(ProfilesDiToken.CANDIDATE_PROFILE_REPOSITORY)
    private readonly candidateProfileRepository: ICandidateProfileRepository,
    @Inject(ProfilesDiToken.RECRUITER_PROFILE_REPOSITORY)
    private readonly recruiterProfileRepository: IRecruiterProfileRepository,
    @Inject(CompaniesDiToken.COMPANIES_QUERY_SERVICE)
    private readonly companiesQueryService: ICompaniesQueryService,
    private readonly supabaseClientService: SupabaseClientService,
    @Inject(SupabaseUserMapper)
    private readonly supabaseUserMapper: SupabaseUserMapper,
  ) {
    super();
  }

  protected async implementation(): Promise<{
    user: IUserWithDetails;
    profile: CandidateProfile | RecruiterProfile | null;
  }> {
    const { userId, accessToken } = this._input;

    const { data, error } = await this.supabaseClientService.client.auth.getUser(accessToken);
    if (error) throw new Error('Failed to get auth user data');

    if (data.user.id !== userId) {
      throw new Error('Unauthorized access to user profile');
    }

    const authUser = this.supabaseUserMapper.toDomain(data.user);

    const userDetails = await this.userDetailsRepository.findByUserId(userId);

    if (!userDetails) {
      throw new Error('User details not found');
    }

    let profile: CandidateProfile | RecruiterProfile | null = null;

    if (userDetails.role === UserRole.CANDIDATE) {
      profile = await this.candidateProfileRepository.findByUserDetailsId(userDetails.id);
    } else if (userDetails.role === UserRole.RECRUITER) {
      const recruiterProfile = await this.recruiterProfileRepository.findByUserDetailsId(userDetails.id);

      if (recruiterProfile) {
        const activeCompanyId = await this.companiesQueryService.getActiveCompanyIdByRecruiterProfileId(
          recruiterProfile.id,
        );
        
        profile = RecruiterProfile.builder(recruiterProfile.userDetailsId)
          .id(recruiterProfile.id)
          .telegram(recruiterProfile.telegram)
          .phone(recruiterProfile.phone)
          .linkedin(recruiterProfile.linkedin)
          .website(recruiterProfile.website)
          .createdAt(recruiterProfile.createdAt)
          .updatedAt(recruiterProfile.updatedAt)
          .activeCompanyId(activeCompanyId)
          .build();
      }
    }

    const userWithDetails: IUserWithDetails = {
      ...authUser,
      fullName: userDetails.fullName,
      role: userDetails.role,
      createdAt: userDetails.createdAt,
      updatedAt: userDetails.updatedAt,
    };

    return {
      user: userWithDetails,
      profile,
    };
  }
}
