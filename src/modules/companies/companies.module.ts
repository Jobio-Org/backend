import { Module, forwardRef } from '@nestjs/common';

import { CreateCompanyUseCase } from '~modules/companies/application/use-cases/companies/create-company/create-company.use-case';
import { GetAllCompaniesUseCase } from '~modules/companies/application/use-cases/companies/get-all-companies/get-all-companies.use-case';
import { GetCompaniesByRecruiterUseCase } from '~modules/companies/application/use-cases/companies/get-companies-by-recruiter/get-companies-by-recruiter.use-case';
import { GetCompanyByIdUseCase } from '~modules/companies/application/use-cases/companies/get-company-by-id/get-company-by-id.use-case';
import { GetCompanyBySlugUseCase } from '~modules/companies/application/use-cases/companies/get-company-by-slug/get-company-by-slug.use-case';
import { UpdateCompanyUseCase } from '~modules/companies/application/use-cases/companies/update-company/update-company.use-case';
import { AcceptInvitationUseCase } from '~modules/companies/application/use-cases/company-invitations/accept-invitation/accept-invitation.use-case';
import { SendInvitationUseCase } from '~modules/companies/application/use-cases/company-invitations/send-invitation/send-invitation.use-case';
import { CreateUserCompanyUseCase } from '~modules/companies/application/use-cases/user-companies/create-user-company/create-user-company.use-case';
import { CompaniesDiToken } from '~modules/companies/constants';
import { CompanyCategoryMapper } from '~modules/companies/domain/mappers/company-category/company-category.mapper';
import { CompanyInvitationMapper } from '~modules/companies/domain/mappers/company-invitation/company-invitation.mapper';
import { CompanyPermissionMapper } from '~modules/companies/domain/mappers/company-permission/company-permission.mapper';
import { CompanyRolePermissionMapper } from '~modules/companies/domain/mappers/company-role-permission/company-role-permission.mapper';
import { CompanyRoleMapper } from '~modules/companies/domain/mappers/company-role/company-role.mapper';
import { CompanyWithCategoriesMapper } from '~modules/companies/domain/mappers/company/company-with-categories.mapper';
import { CompanyMapper } from '~modules/companies/domain/mappers/company/company.mapper';
import { UserCompanyMapper } from '~modules/companies/domain/mappers/user-company/user-company.mapper';
import { CompaniesController } from '~modules/companies/infrastructure/controllers/companies/companies.controller';
import { RecruiterProfileCreatedEventHandler } from '~modules/companies/infrastructure/event-handlers/recruiter-profile-created.event-handler';
import { DrizzleCompanyCategoryRepository } from '~modules/companies/infrastructure/persistence/drizzle/repositories/drizzle-company-category.repository';
import { DrizzleCompanyInvitationRepository } from '~modules/companies/infrastructure/persistence/drizzle/repositories/drizzle-company-invitation.repository';
import { DrizzleCompanyPermissionRepository } from '~modules/companies/infrastructure/persistence/drizzle/repositories/drizzle-company-permission.repository';
import { DrizzleCompanyRolePermissionRepository } from '~modules/companies/infrastructure/persistence/drizzle/repositories/drizzle-company-role-permission.repository';
import { DrizzleCompanyRoleRepository } from '~modules/companies/infrastructure/persistence/drizzle/repositories/drizzle-company-role.repository';
import { DrizzleCompanyRepository } from '~modules/companies/infrastructure/persistence/drizzle/repositories/drizzle-company.repository';
import { DrizzleUserCompanyRepository } from '~modules/companies/infrastructure/persistence/drizzle/repositories/drizzle-user-company.repository';
import { CompaniesQueryService } from '~modules/companies/infrastructure/services/companies-query.service';
import { CompanyPermissionQueryService } from '~modules/companies/infrastructure/services/company-permission-query.service';
import { RecruiterProfileModule } from '~modules/recruiter-profile/recruiter-profile.module';

import { PaginationService } from '~shared/infrastructure/services/pagination/pagination.service';
import { SlugService } from '~shared/infrastructure/services/slug/slug.service';

@Module({
  imports: [forwardRef(() => RecruiterProfileModule)],
  providers: [
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
      provide: CompaniesDiToken.GET_COMPANY_BY_ID_USE_CASE,
      useClass: GetCompanyByIdUseCase,
    },
    {
      provide: CompaniesDiToken.GET_COMPANY_BY_SLUG_USE_CASE,
      useClass: GetCompanyBySlugUseCase,
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
    CompanyCategoryMapper,
    CompanyWithCategoriesMapper,
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
      provide: CompaniesDiToken.COMPANY_CATEGORY_REPOSITORY,
      useClass: DrizzleCompanyCategoryRepository,
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

    { provide: CompaniesDiToken.COMPANY_REPOSITORY, useClass: DrizzleCompanyRepository },
    { provide: CompaniesDiToken.USER_COMPANY_REPOSITORY, useClass: DrizzleUserCompanyRepository },
    {
      provide: CompaniesDiToken.GET_ALL_COMPANIES_WITH_USERS_USE_CASE,
      useClass: GetAllCompaniesUseCase,
    },
    SlugService,
    PaginationService,
    {
      provide: CompaniesDiToken.GET_COMPANIES_BY_RECRUITER_USE_CASE,
      useClass: GetCompaniesByRecruiterUseCase,
    },
  ],
  controllers: [CompaniesController],
  exports: [CompaniesDiToken.COMPANIES_QUERY_SERVICE],
})
export class CompaniesModule {}
