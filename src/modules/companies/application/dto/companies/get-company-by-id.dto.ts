import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

import { CompanyWithCategoriesDto } from '~modules/companies/application/dto/company-categories/company-category.dto';

export type GetCompanyByIdResponseDto = CompanyWithCategoriesDto;

export class GetCompanyByIdParamDto {
  @ApiProperty({ description: 'Company ID' })
  @IsUUID()
  companyId: string;
}
