import { Body, Controller, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PublicRoute } from '~modules/auth/infrastructure/decorators/public-route/public-route.decorator';
import { UserId } from '~modules/auth/infrastructure/decorators/user-id/user-id.decorator';
import { JwtAccessAuthGuard } from '~modules/auth/infrastructure/supabase/guards/jwt-access-auth/jwt-access-auth.guard';
import { GetAllCompaniesDto } from '~modules/companies/application/dto/companies/get-all-companies.dto';
import {
  GetCompaniesByRecruiterDto,
  RecruiterProfileIdParamDto,
} from '~modules/companies/application/dto/companies/get-companies-by-recruiter.dto';
import { UpdateCompanyDto } from '~modules/companies/application/dto/companies/update-company.dto';
import { AcceptInvitationDto } from '~modules/companies/application/dto/company-invitations/accept-invitation.dto';
import { InviteRecruiterDto } from '~modules/companies/application/dto/company-invitations/invite-recruiter.dto';
import { InsufficientPermissionsException } from '~modules/companies/application/exceptions/company-permissions/insufficient-permissions.exception';
import { ICompanyPermissionQueryService } from '~modules/companies/application/services/company-permissions/company-permission-query-service.interface';
import { GetAllCompaniesUseCase } from '~modules/companies/application/use-cases/companies/get-all-companies/get-all-companies.use-case';
import { GetCompaniesByRecruiterUseCase } from '~modules/companies/application/use-cases/companies/get-companies-by-recruiter/get-companies-by-recruiter.use-case';
import { IUpdateCompanyUseCase } from '~modules/companies/application/use-cases/companies/update-company/update-company-use-case.interface';
import { IAcceptInvitationUseCase } from '~modules/companies/application/use-cases/company-invitations/accept-invitation/accept-invitation-use-case.interface';
import { ISendInvitationUseCase } from '~modules/companies/application/use-cases/company-invitations/send-invitation/send-invitation-use-case.interface';
import { CompaniesDiToken } from '~modules/companies/constants';
import { Company } from '~modules/companies/domain/entities/company.entity';
import { CompanyPermissionList } from '~modules/companies/domain/enums/company-management.enum';

import { PaginationResult } from '~shared/application/models/pagination.model';
import { PaginationQuery } from '~shared/infrastructure/decorators/pagination/pagination.decorator';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(
    @Inject(CompaniesDiToken.UPDATE_COMPANY_USE_CASE)
    private readonly updateCompanyUseCase: IUpdateCompanyUseCase,
    @Inject(CompaniesDiToken.COMPANY_PERMISSION_QUERY_SERVICE)
    private readonly companyPermissionQueryService: ICompanyPermissionQueryService,
    @Inject(CompaniesDiToken.SEND_INVITATION_USE_CASE)
    private readonly sendInvitationUseCase: ISendInvitationUseCase,
    @Inject(CompaniesDiToken.ACCEPT_INVITATION_USE_CASE)
    private readonly acceptInvitationUseCase: IAcceptInvitationUseCase,
    @Inject(CompaniesDiToken.GET_ALL_COMPANIES_WITH_USERS_USE_CASE)
    private readonly getAllCompaniesUseCase: GetAllCompaniesUseCase,
    @Inject(CompaniesDiToken.GET_COMPANIES_BY_RECRUITER_USE_CASE)
    private readonly getCompaniesByRecruiterUseCase: GetCompaniesByRecruiterUseCase,
  ) {}

  @ApiOperation({
    summary: 'Update company information',
    description: `Update company information. Only users with ${CompanyPermissionList.EDIT_COMPANY_INFO} permission can perform this action.`,
  })
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ type: Company })
  @Put(':companyId')
  async updateCompany(
    @Param('companyId') companyId: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @UserId() userId: string,
  ): Promise<Company> {
    const canEdit = await this.companyPermissionQueryService.canEditCompanyInfo(userId, companyId);

    if (!canEdit) {
      throw new InsufficientPermissionsException();
    }

    return await this.updateCompanyUseCase.execute({
      companyId,
      ...updateCompanyDto,
    });
  }

  @ApiOperation({
    summary: 'Invite recruiter to company',
    description: `Send invitation to recruiter to join company. Only users with ${CompanyPermissionList.INVITE_USERS} permission can perform this action.`,
  })
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('invitations')
  async inviteRecruiter(@Body() dto: InviteRecruiterDto, @UserId() userId: string): Promise<void> {
    await this.sendInvitationUseCase.execute({ dto, inviterUserId: userId });
  }

  @ApiOperation({
    summary: 'Accept company invitation',
    description: 'Accept invitation to join company using invitation token.',
  })
  @UseGuards(JwtAccessAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('invitations/accept')
  async acceptInvitation(@Body() dto: AcceptInvitationDto, @UserId() userId: string): Promise<void> {
    await this.acceptInvitationUseCase.execute({ dto, userId });
  }

  @ApiOperation({ summary: 'Get all companies' })
  @ApiQuery({ type: GetAllCompaniesDto })
  @ApiResponse({ type: PaginationResult })
  @PublicRoute()
  @Get()
  async getCompanies(@PaginationQuery() query: GetAllCompaniesDto): Promise<PaginationResult<Company>> {
    return this.getAllCompaniesUseCase.execute(query);
  }

  @ApiOperation({ summary: 'Get companies by recruiter profile id' })
  @ApiQuery({ type: GetCompaniesByRecruiterDto })
  @ApiResponse({ type: PaginationResult })
  @PublicRoute()
  @Get('by-recruiter/:recruiterProfileId')
  async getCompaniesByRecruiter(
    @Param() params: RecruiterProfileIdParamDto,
    @PaginationQuery() query: GetCompaniesByRecruiterDto,
  ): Promise<PaginationResult<Company>> {
    return this.getCompaniesByRecruiterUseCase.execute({ ...query, recruiterProfileId: params.recruiterProfileId });
  }
}
