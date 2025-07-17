import { Inject, Injectable } from '@nestjs/common';

import { ICompanyPermissionQueryService } from '~modules/companies/application/services/company-permission-query-service.interface';
import { CompaniesDiToken } from '~modules/companies/constants';
import { CompanyPermissionList, CompanyRoleType } from '~modules/companies/domain/enums/company-management.enum';
import { ICompanyPermissionRepository } from '~modules/companies/domain/repositories/company-permission-repository.interface';
import { ICompanyRolePermissionRepository } from '~modules/companies/domain/repositories/company-role-permission-repository.interface';
import { ICompanyRoleRepository } from '~modules/companies/domain/repositories/company-role-repository.interface';
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
    @Inject(CompaniesDiToken.COMPANY_ROLE_REPOSITORY)
    private readonly companyRoleRepository: ICompanyRoleRepository,
    @Inject(ProfilesDiToken.PROFILES_QUERY_SERVICE)
    private readonly profilesQueryService: IProfilesQueryService,
  ) {}

  async canEditCompanyInfo(userId: string, companyId: string): Promise<boolean> {
    const recruiterProfile = await this.profilesQueryService.getRecruiterProfileByUserId(userId);

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

  async canInviteWithRole(userId: string, companyId: string, roleId: string, permissions?: string[]): Promise<boolean> {
    // 1. Знайти recruiterProfile для userId
    const recruiterProfile = await this.profilesQueryService.getRecruiterProfileByUserId(userId);
    console.log("🚀 ~ CompanyPermissionQueryService ~ canInviteWithRole ~ recruiterProfile:", recruiterProfile)
    if (!recruiterProfile) return false;

    // 2. Знайти userCompany (роль користувача у цій компанії)
    const userCompany = await this.userCompanyRepository.findByRecruiterProfileIdAndCompanyId(
      recruiterProfile.id,
      companyId,
    );
    console.log("🚀 ~ CompanyPermissionQueryService ~ canInviteWithRole ~ userCompany:", userCompany)
    if (!userCompany) return false;

    // 3. Перевірити, чи має роль користувача право INVITE_USERS
    const invitePermission = await this.companyPermissionRepository.findByName(CompanyPermissionList.INVITE_USERS);
    console.log("🚀 ~ CompanyPermissionQueryService ~ canInviteWithRole ~ invitePermission:", invitePermission)
    if (!invitePermission) return false;

    const hasInvitePermission = await this.companyRolePermissionRepository.hasPermission(
      userCompany.companyRoleId,
      invitePermission.id,
    );
    console.log("🚀 ~ CompanyPermissionQueryService ~ canInviteWithRole ~ hasInvitePermission:", hasInvitePermission)
    if (!hasInvitePermission) return false;

    return true;
  }
}
