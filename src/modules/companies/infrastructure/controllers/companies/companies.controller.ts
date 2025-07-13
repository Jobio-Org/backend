import { Body, Controller, Inject, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserId } from '~modules/auth/infrastructure/decorators/user-id/user-id.decorator';
import { JwtAccessAuthGuard } from '~modules/auth/infrastructure/supabase/guards/jwt-access-auth/jwt-access-auth.guard';
import { UpdateCompanyDto } from '~modules/companies/application/dto/update-company.dto';
import { InsufficientPermissionsException } from '~modules/companies/application/exceptions/insufficient-permissions.exception';
import { ICompanyPermissionService } from '~modules/companies/application/services/company-permission-service.interface';
import { IUpdateCompanyUseCase } from '~modules/companies/application/use-cases/companies/update-company/update-company-use-case.interface';
import { CompaniesDiToken } from '~modules/companies/constants';
import { Company } from '~modules/companies/domain/entities/company.entity';

@ApiTags('companies')
@ApiBearerAuth('JWT-auth')
@Controller('companies')
@UseGuards(JwtAccessAuthGuard)
export class CompaniesController {
  constructor(
    @Inject(CompaniesDiToken.UPDATE_COMPANY_USE_CASE)
    private readonly updateCompanyUseCase: IUpdateCompanyUseCase,
    @Inject(CompaniesDiToken.COMPANY_PERMISSION_SERVICE)
    private readonly companyPermissionService: ICompanyPermissionService,
  ) {}

  @ApiOperation({
    summary: 'Update company information',
    description: 'Update company information. Only users with ADMIN role can perform this action.',
  })
  @Put(':companyId')
  async updateCompany(
    @Param('companyId') companyId: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @UserId() userId: string,
  ): Promise<Company> {
    const canEdit = await this.companyPermissionService.canEditCompanyInfo(userId, companyId);

    if (!canEdit) {
      throw new InsufficientPermissionsException('You do not have permission to edit company information');
    }

    return await this.updateCompanyUseCase.execute({
      companyId,
      ...updateCompanyDto,
    });
  }
}
