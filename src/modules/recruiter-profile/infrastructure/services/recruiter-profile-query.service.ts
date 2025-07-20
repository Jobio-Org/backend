import { Inject, Injectable } from '@nestjs/common';

import { ICompaniesQueryService } from '~modules/companies/application/services/companies/companies-query-service.interface';
import { CompaniesDiToken } from '~modules/companies/constants';
import { GetRecruiterProfileByEmailDto } from '~modules/recruiter-profile/application/dto/get-recruiter-profile-by-email.dto';
import { GetRecruiterProfileByUserDetailsIdDto } from '~modules/recruiter-profile/application/dto/get-recruiter-profile-by-user-details-id.dto';
import { GetRecruiterProfileByUserIdDto } from '~modules/recruiter-profile/application/dto/get-recruiter-profile-by-user-id.dto';
import { IRecruiterProfileQueryService } from '~modules/recruiter-profile/application/services/recruiter-profile-query-service.interface';
import { IGetRecruiterProfileByEmailUseCase } from '~modules/recruiter-profile/application/use-cases/get-recruiter-profile-by-email/get-recruiter-profile-by-email-use-case.interface';
import { IGetRecruiterProfileUseCase } from '~modules/recruiter-profile/application/use-cases/get-recruiter-profile/get-recruiter-profile-use-case.interface';
import { RecruiterProfileDiToken } from '~modules/recruiter-profile/constants';
import { RecruiterProfile } from '~modules/recruiter-profile/domain/entities/recruiter-profile.entity';
import { IRecruiterProfileRepository } from '~modules/recruiter-profile/domain/repositories/recruiter-profile-repository.interface';

@Injectable()
export class RecruiterProfileQueryService implements IRecruiterProfileQueryService {
  constructor(
    @Inject(RecruiterProfileDiToken.GET_RECRUITER_PROFILE_USE_CASE)
    private readonly getRecruiterProfileIdUseCase: IGetRecruiterProfileUseCase,
    @Inject(RecruiterProfileDiToken.GET_RECRUITER_PROFILE_BY_EMAIL_USE_CASE)
    private readonly getRecruiterProfileByEmailUseCase: IGetRecruiterProfileByEmailUseCase,
    @Inject(RecruiterProfileDiToken.RECRUITER_PROFILE_REPOSITORY)
    private readonly recruiterProfileRepository: IRecruiterProfileRepository,
    @Inject(CompaniesDiToken.COMPANIES_QUERY_SERVICE)
    private readonly companiesQueryService: ICompaniesQueryService,
  ) {}
  async getRecruiterProfileByUserDetailsId(userDetailsId: string): Promise<RecruiterProfile | null> {
    const dto = new GetRecruiterProfileByUserDetailsIdDto(userDetailsId);

    const recruiterProfile = await this.recruiterProfileRepository.findByUserDetailsId(dto.userDetailsId);

    if (!recruiterProfile) {
      return null;
    }

    const activeCompanyId = await this.companiesQueryService.getActiveCompanyIdByRecruiterProfileId(
      recruiterProfile.id,
    );

    return RecruiterProfile.builder(recruiterProfile.userDetailsId)
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

  async getRecruiterProfileByUserId(userId: string): Promise<RecruiterProfile | null> {
    const dto = new GetRecruiterProfileByUserIdDto(userId);

    return this.getRecruiterProfileIdUseCase.execute(dto);
  }

  async getRecruiterProfileByEmail(email: string): Promise<RecruiterProfile | null> {
    const dto = new GetRecruiterProfileByEmailDto(email);

    return this.getRecruiterProfileByEmailUseCase.execute(dto);
  }
}
