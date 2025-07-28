import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

import { CompanyWithCategoriesDto } from '~modules/companies/application/dto/company-categories/company-category.dto';

export type GetCompanyByIdResponseDto = CompanyWithCategoriesDto;

export class GetCompanyByIdParamDto {
  @ApiProperty({ description: 'Company ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  companyId: string;
}
