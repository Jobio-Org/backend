import { IsOptional, IsUUID } from 'class-validator';

import { Company } from '~modules/companies/domain/entities/company.entity';

export class CompanyCategoryDto {
  @IsUUID()
  categoryId: string;

  @IsUUID()
  @IsOptional()
  subCategoryId?: string;
}

export class CompanyCategoryResponseDto {
  categoryId: string;
  categoryName: string;
  subCategoryId?: string;
  subCategoryName?: string;
}

export class CompanyWithCategoriesDto extends Company {
  categories: CompanyCategoryResponseDto[];
}
