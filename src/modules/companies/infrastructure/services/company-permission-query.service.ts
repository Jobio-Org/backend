import { Inject, Injectable } from '@nestjs/common';

import { ICompanyPermissionQueryService } from '~modules/companies/application/services/company-permissions/company-permission-query-service.interface';
import { CompaniesDiToken } from '~modules/companies/constants';
import { CompanyPermissionList } from '~modules/companies/domain/enums/company-management.enum';
import { ICompanyPermissionRepository } from '~modules/companies/domain/repositories/company-permission-repository.interface';
import { ICompanyRolePermissionRepository } from '~modules/companies/domain/repositories/company-role-permission-repository.interface';
import { IUserCompanyRepository } from '~modules/companies/domain/repositories/user-company-repository.interface';
import { IRecruiterProfileQueryService } from '~modules/recruiter-profile/application/services/recruiter-profile-query-service.interface';
import { RecruiterProfileDiToken } from '~modules/recruiter-profile/constants';

@Injectable()
export class CompanyPermissionQueryService implements ICompanyPermissionQueryService {
  constructor(
    @Inject(CompaniesDiToken.USER_COMPANY_REPOSITORY)
    private readonly userCompanyRepository: IUserCompanyRepository,
    @Inject(CompaniesDiToken.COMPANY_ROLE_PERMISSION_REPOSITORY)
    private readonly companyRolePermissionRepository: ICompanyRolePermissionRepository,
    @Inject(CompaniesDiToken.COMPANY_PERMISSION_REPOSITORY)
    private readonly companyPermissionRepository: ICompanyPermissionRepository,
    @Inject(RecruiterProfileDiToken.RECRUITER_PROFILE_QUERY_SERVICE)
    private readonly recruiterProfileQueryService: IRecruiterProfileQueryService,
  ) {}

  async canEditCompanyInfo(userId: string, companyId: string): Promise<boolean> {
    const recruiterProfile = await this.recruiterProfileQueryService.getRecruiterProfileByUserId(userId);

    if (!recruiterProfile) {
      return false;
    }

    const userCompany = await this.userCompanyRepository.findByRecruiterProfileIdAndCompanyId(
      recruiterProfile.id,
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

  async canInviteWithRole(userId: string, companyId: string): Promise<boolean> {
    const recruiterProfile = await this.recruiterProfileQueryService.getRecruiterProfileByUserId(userId);
    if (!recruiterProfile) return false;

    const userCompany = await this.userCompanyRepository.findByRecruiterProfileIdAndCompanyId(
      recruiterProfile.id,
      companyId,
    );
    if (!userCompany) return false;

    const invitePermission = await this.companyPermissionRepository.findByName(CompanyPermissionList.INVITE_USERS);
    if (!invitePermission) return false;

    const hasInvitePermission = await this.companyRolePermissionRepository.hasPermission(
      userCompany.companyRoleId,
      invitePermission.id,
    );
    if (!hasInvitePermission) return false;

    return true;
  }
}
