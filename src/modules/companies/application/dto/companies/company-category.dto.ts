import { IsOptional, IsUUID } from 'class-validator';

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

export class CompanyWithCategoriesDto {
  id: string;
  name: string;
  description?: string;
  website?: string;
  logo?: string;
  industry?: string;
  size?: string;
  location?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  categories: CompanyCategoryResponseDto[];
}
