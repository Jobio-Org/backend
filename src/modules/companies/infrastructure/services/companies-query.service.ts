import { Inject, Injectable } from '@nestjs/common';

import { ICompaniesQueryService } from '~modules/companies/application/services/companies/companies-query-service.interface';
import { CompaniesDiToken } from '~modules/companies/constants';
import { IUserCompanyRepository } from '~modules/companies/domain/repositories/user-company-repository.interface';

@Injectable()
export class CompaniesQueryService implements ICompaniesQueryService {
  constructor(
    @Inject(CompaniesDiToken.USER_COMPANY_REPOSITORY)
    private readonly userCompanyRepository: IUserCompanyRepository,
  ) {}

  async getActiveCompanyIdByRecruiterProfileId(recruiterProfileId: string): Promise<string | null> {
    const userCompanies = await this.userCompanyRepository.findByRecruiterProfileId(recruiterProfileId);

    if (userCompanies.length === 0) {
      return null;
    }

    const activeCompany = userCompanies.find(uc => uc.isActive);
    
    if (activeCompany) {
      return activeCompany.companyId;
    }

    return userCompanies[0].companyId;
  }
} 