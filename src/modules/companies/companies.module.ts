import { Module, forwardRef } from '@nestjs/common';

import { CreateCompanyUseCase } from '~modules/companies/application/use-cases/companies/create-company/create-company.use-case';
import { GetAllCompaniesUseCase } from '~modules/companies/application/use-cases/companies/get-all-companies/get-all-companies.use-case';
import { GetCompaniesByRecruiterUseCase } from '~modules/companies/application/use-cases/companies/get-companies-by-recruiter/get-companies-by-recruiter.use-case';
import { UpdateCompanyUseCase } from '~modules/companies/application/use-cases/companies/update-company/update-company.use-case';
import { AcceptInvitationUseCase } from '~modules/companies/application/use-cases/company-invitations/accept-invitation/accept-invitation.use-case';
import { SendInvitationUseCase } from '~modules/companies/application/use-cases/company-invitations/send-invitation/send-invitation.use-case';
import { RunCompanyPermissionSeedsUseCase } from '~modules/companies/application/use-cases/seeds/run-company-permission-seeds/run-company-permission-seeds.use-case';
import { RunCompanyRolePermissionSeedsUseCase } from '~modules/companies/application/use-cases/seeds/run-company-role-permission-seeds/run-company-role-permission-seeds.use-case';
import { RunCompanyRoleSeedsUseCase } from '~modules/companies/application/use-cases/seeds/run-company-role-seeds/run-company-role-seeds.use-case';
import { RunCompanySeedsUseCase } from '~modules/companies/application/use-cases/seeds/run-company-seeds/run-company-seeds.use-case';
import { CreateUserCompanyUseCase } from '~modules/companies/application/use-cases/user-companies/create-user-company/create-user-company.use-case';
import { CompaniesDiToken } from '~modules/companies/constants';
import { CompanyInvitationMapper } from '~modules/companies/domain/mappers/company-invitation/company-invitation.mapper';
import { CompanyPermissionMapper } from '~modules/companies/domain/mappers/company-permission/company-permission.mapper';
import { CompanyRolePermissionMapper } from '~modules/companies/domain/mappers/company-role-permission/company-role-permission.mapper';
import { CompanyRoleMapper } from '~modules/companies/domain/mappers/company-role/company-role.mapper';
import { CompanyMapper } from '~modules/companies/domain/mappers/company/company.mapper';
import { UserCompanyMapper } from '~modules/companies/domain/mappers/user-company/user-company.mapper';
import { CompaniesController } from '~modules/companies/infrastructure/controllers/companies/companies.controller';
import { RecruiterProfileCreatedEventHandler } from '~modules/companies/infrastructure/event-handlers/recruiter-profile-created.event-handler';
import { DrizzleCompanyInvitationRepository } from '~modules/companies/infrastructure/persistence/drizzle/repositories/drizzle-company-invitation.repository';
import { DrizzleCompanyPermissionRepository } from '~modules/companies/infrastructure/persistence/drizzle/repositories/drizzle-company-permission.repository';
import { DrizzleCompanyRolePermissionRepository } from '~modules/companies/infrastructure/persistence/drizzle/repositories/drizzle-company-role-permission.repository';
import { DrizzleCompanyRoleRepository } from '~modules/companies/infrastructure/persistence/drizzle/repositories/drizzle-company-role.repository';
import { DrizzleCompanyRepository } from '~modules/companies/infrastructure/persistence/drizzle/repositories/drizzle-company.repository';
import { DrizzleUserCompanyRepository } from '~modules/companies/infrastructure/persistence/drizzle/repositories/drizzle-user-company.repository';
import { CompaniesQueryService } from '~modules/companies/infrastructure/services/companies-query.service';
import { CompanyPermissionQueryService } from '~modules/companies/infrastructure/services/company-permission-query.service';
import { CompanySeedsRegistrationService } from '~modules/companies/infrastructure/services/company-seeds-registration.service';
import { ProfilesDiToken } from '~modules/profiles/constants';
import { ProfilesQueryService } from '~modules/profiles/infrastructure/services/profiles-query.service';
import { UserDetailsQueryService } from '~modules/profiles/infrastructure/services/user-details-query.service';
import { ProfilesModule } from '~modules/profiles/profiles.module';

import { PaginationService } from '~shared/infrastructure/services/pagination/pagination.service';

@Module({
  imports: [forwardRef(() => ProfilesModule)],
  providers: [
    {
      provide: CompaniesDiToken.RUN_COMPANY_SEEDS_USE_CASE,
      useClass: RunCompanySeedsUseCase,
    },
    {
      provide: CompaniesDiToken.RUN_COMPANY_PERMISSION_SEEDS_USE_CASE,
      useClass: RunCompanyPermissionSeedsUseCase,
    },
    {
      provide: CompaniesDiToken.RUN_COMPANY_ROLE_SEEDS_USE_CASE,
      useClass: RunCompanyRoleSeedsUseCase,
    },
    {
      provide: CompaniesDiToken.RUN_COMPANY_ROLE_PERMISSION_SEEDS_USE_CASE,
      useClass: RunCompanyRolePermissionSeedsUseCase,
    },
    {
      provide: CompaniesDiToken.CREATE_COMPANY_USE_CASE,
      useClass: CreateCompanyUseCase,
    },
    {
      provide: CompaniesDiToken.CREATE_USER_COMPANY_USE_CASE,
      useClass: CreateUserCompanyUseCase,
    },
    {
      provide: CompaniesDiToken.UPDATE_COMPANY_USE_CASE,
      useClass: UpdateCompanyUseCase,
    },
    {
      provide: CompaniesDiToken.COMPANY_PERMISSION_QUERY_SERVICE,
      useClass: CompanyPermissionQueryService,
    },
    {
      provide: CompaniesDiToken.COMPANIES_QUERY_SERVICE,
      useClass: CompaniesQueryService,
    },
    CompanyMapper,
    CompanyPermissionMapper,
    CompanyRoleMapper,
    CompanyRolePermissionMapper,
    CompanyInvitationMapper,
    UserCompanyMapper,
    {
      provide: CompaniesDiToken.COMPANY_REPOSITORY,
      useClass: DrizzleCompanyRepository,
    },
    {
      provide: CompaniesDiToken.COMPANY_PERMISSION_REPOSITORY,
      useClass: DrizzleCompanyPermissionRepository,
    },
    {
      provide: CompaniesDiToken.COMPANY_ROLE_REPOSITORY,
      useClass: DrizzleCompanyRoleRepository,
    },
    {
      provide: CompaniesDiToken.COMPANY_ROLE_PERMISSION_REPOSITORY,
      useClass: DrizzleCompanyRolePermissionRepository,
    },
    {
      provide: CompaniesDiToken.USER_COMPANY_REPOSITORY,
      useClass: DrizzleUserCompanyRepository,
    },
    RecruiterProfileCreatedEventHandler,
    {
      provide: CompaniesDiToken.SEND_INVITATION_USE_CASE,
      useClass: SendInvitationUseCase,
    },
    {
      provide: CompaniesDiToken.ACCEPT_INVITATION_USE_CASE,
      useClass: AcceptInvitationUseCase,
    },
    {
      provide: CompaniesDiToken.COMPANY_INVITATION_REPOSITORY,
      useClass: DrizzleCompanyInvitationRepository,
    },
    { provide: ProfilesDiToken.PROFILES_QUERY_SERVICE, useClass: ProfilesQueryService },
    { provide: CompaniesDiToken.COMPANY_REPOSITORY, useClass: DrizzleCompanyRepository },
    { provide: CompaniesDiToken.USER_COMPANY_REPOSITORY, useClass: DrizzleUserCompanyRepository },
    { provide: ProfilesDiToken.USER_DETAILS_QUERY_SERVICE, useClass: UserDetailsQueryService },
    {
      provide: CompaniesDiToken.GET_ALL_COMPANIES_WITH_USERS_USE_CASE,
      useClass: GetAllCompaniesUseCase,
    },
    PaginationService,
    {
      provide: CompaniesDiToken.GET_COMPANIES_BY_RECRUITER_USE_CASE,
      useClass: GetCompaniesByRecruiterUseCase,
    },
    CompanySeedsRegistrationService,
  ],
  controllers: [CompaniesController],
  exports: [
    CompaniesDiToken.RUN_COMPANY_SEEDS_USE_CASE,
    CompaniesDiToken.RUN_COMPANY_PERMISSION_SEEDS_USE_CASE,
    CompaniesDiToken.RUN_COMPANY_ROLE_SEEDS_USE_CASE,
    CompaniesDiToken.RUN_COMPANY_ROLE_PERMISSION_SEEDS_USE_CASE,
    CompaniesDiToken.COMPANIES_QUERY_SERVICE,
  ],
})
export class CompaniesModule {}
