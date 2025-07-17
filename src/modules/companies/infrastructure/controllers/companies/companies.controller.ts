import { Body, Controller, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserId } from '~modules/auth/infrastructure/decorators/user-id/user-id.decorator';
import { JwtAccessAuthGuard } from '~modules/auth/infrastructure/supabase/guards/jwt-access-auth/jwt-access-auth.guard';
import { UpdateCompanyDto } from '~modules/companies/application/dto/companies/update-company.dto';
import { AcceptInvitationDto } from '~modules/companies/application/dto/company-invitations/accept-invitation.dto';
import { InviteRecruiterDto } from '~modules/companies/application/dto/company-invitations/invite-recruiter.dto';
import { InsufficientPermissionsException } from '~modules/companies/application/exceptions/company-permissions/insufficient-permissions.exception';
import { ICompanyPermissionQueryService } from '~modules/companies/application/services/company-permissions/company-permission-query-service.interface';
import { IUpdateCompanyUseCase } from '~modules/companies/application/use-cases/companies/update-company/update-company-use-case.interface';
import { IAcceptInvitationUseCase } from '~modules/companies/application/use-cases/company-invitations/accept-invitation/accept-invitation-use-case.interface';
import { ISendInvitationUseCase } from '~modules/companies/application/use-cases/company-invitations/send-invitation/send-invitation-use-case.interface';
import { CompaniesDiToken } from '~modules/companies/constants';
import { Company } from '~modules/companies/domain/entities/company.entity';
import { CompanyPermissionList } from '~modules/companies/domain/enums/company-management.enum';

@ApiTags('companies')
@ApiBearerAuth('JWT-auth')
@Controller('companies')
@UseGuards(JwtAccessAuthGuard)
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
  ) {}

  @ApiOperation({
    summary: 'Update company information',
    description: `Update company information. Only users with ${CompanyPermissionList.EDIT_COMPANY_INFO} permission can perform this action.`,
  })
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
  @Post('invitations')
  async inviteRecruiter(@Body() dto: InviteRecruiterDto, @UserId() userId: string): Promise<void> {
    await this.sendInvitationUseCase.execute({ dto, inviterUserId: userId });
  }

  @ApiOperation({
    summary: 'Accept company invitation',
    description: 'Accept invitation to join company using invitation token.',
  })
  @Post('invitations/accept')
  async acceptInvitation(@Body() dto: AcceptInvitationDto, @UserId() userId: string): Promise<void> {
    await this.acceptInvitationUseCase.execute({ dto, userId });
  }
}
