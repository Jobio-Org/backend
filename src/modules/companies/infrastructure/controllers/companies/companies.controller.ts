import { Body, Controller, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { User } from '~modules/auth/domain/entities/user.entity';
import { UserId } from '~modules/auth/infrastructure/decorators/user-id/user-id.decorator';
import { ReqUser } from '~modules/auth/infrastructure/decorators/user/user.decorator';
import { JwtAccessAuthGuard } from '~modules/auth/infrastructure/supabase/guards/jwt-access-auth/jwt-access-auth.guard';
import { InviteRecruiterDto } from '~modules/companies/application/dto/invite-recruiter.dto';
import { UpdateCompanyDto } from '~modules/companies/application/dto/update-company.dto';
import { InsufficientPermissionsException } from '~modules/companies/application/exceptions/insufficient-permissions.exception';
import { ICompanyPermissionQueryService } from '~modules/companies/application/services/company-permission-query-service.interface';
import { IUpdateCompanyUseCase } from '~modules/companies/application/use-cases/companies/update-company/update-company-use-case.interface';
import { ISendInvitationUseCase } from '~modules/companies/application/use-cases/send-invitation/send-invitation-use-case.interface';
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
    description:
      'Send invitation to recruiter to join company. Only users with appropriate permissions can perform this action.',
  })
  @Post('invitations')
  async inviteRecruiter(
    @Body() dto: InviteRecruiterDto,
    @ReqUser() user: User,
  ): Promise<void> {
    await this.sendInvitationUseCase.execute({ dto, inviterUserId: user.id });
  }
}
