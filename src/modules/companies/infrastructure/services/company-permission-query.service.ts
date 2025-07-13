import { Inject, Injectable } from '@nestjs/common';

import { ICompanyPermissionQueryService } from '~modules/companies/application/services/company-permission-service.interface';
import { CompaniesDiToken } from '~modules/companies/constants';
import { CompanyPermissionList } from '~modules/companies/domain/enums/company-management.enum';
import { ICompanyPermissionRepository } from '~modules/companies/domain/repositories/company-permission-repository.interface';
import { ICompanyRolePermissionRepository } from '~modules/companies/domain/repositories/company-role-permission-repository.interface';
import { IUserCompanyRepository } from '~modules/companies/domain/repositories/user-company-repository.interface';
import { IProfilesQueryService } from '~modules/profiles/application/services/profiles-query-service.interface';
import { ProfilesDiToken } from '~modules/profiles/constants';

@Injectable()
export class CompanyPermissionQueryService implements ICompanyPermissionQueryService {
  constructor(
    @Inject(CompaniesDiToken.USER_COMPANY_REPOSITORY)
    private readonly userCompanyRepository: IUserCompanyRepository,
    @Inject(CompaniesDiToken.COMPANY_ROLE_PERMISSION_REPOSITORY)
    private readonly companyRolePermissionRepository: ICompanyRolePermissionRepository,
    @Inject(CompaniesDiToken.COMPANY_PERMISSION_REPOSITORY)
    private readonly companyPermissionRepository: ICompanyPermissionRepository,
    @Inject(ProfilesDiToken.PROFILES_QUERY_SERVICE)
    private readonly profilesQueryService: IProfilesQueryService,
  ) {}

  async canEditCompanyInfo(userId: string, companyId: string): Promise<boolean> {
    const recruiterProfileId = await this.profilesQueryService.getRecruiterProfileIdByUserId(userId);

    if (!recruiterProfileId) {
      return false;
    }

    const userCompany = await this.userCompanyRepository.findByRecruiterProfileIdAndCompanyId(
      recruiterProfileId,
      companyId,
    );

    if (!userCompany) {
      return false;
    }

    const permission = await this.companyPermissionRepository.findByName(CompanyPermissionList.EDIT_COMPANY_INFO);

    if (!permission) {
      return false;
    }

    const hasPermission = await this.companyRolePermissionRepository.hasPermission(
      userCompany.companyRoleId,
      permission.id,
    );

    return hasPermission;
  }

  async getUserCompanyRole(userId: string, companyId: string): Promise<string | null> {
    const userCompany = await this.userCompanyRepository.findByRecruiterProfileIdAndCompanyId(userId, companyId);

    if (!userCompany) {
      return null;
    }

    return userCompany.companyRoleId;
  }
}
