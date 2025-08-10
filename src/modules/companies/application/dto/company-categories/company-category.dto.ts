import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

import { Company } from '~modules/companies/domain/entities/company.entity';

export class CompanyCategoryDto {
  @ApiProperty({
    description: 'Category ID',
    example: 'df57c4c3-7dd6-5aef-bed1-8e92de8a5876',
  })
  @IsUUID()
  categoryId: string;

  @ApiProperty({
    description: 'Sub-category ID (optional)',
    required: false,
    example: 'a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6',
  })
  @IsOptional()
  @IsUUID()
  subCategoryId?: string;
}

export class CompanyCategoryResponseDto {
  @ApiProperty({
    description: 'Category ID',
    example: 'df57c4c3-7dd6-5aef-bed1-8e92de8a5876',
  })
  categoryId: string;

  @ApiProperty({
    description: 'Category name',
    example: 'Technology',
  })
  categoryName: string;

  @ApiProperty({
    description: 'Sub-category ID (optional)',
    required: false,
    example: 'a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6',
  })
  subCategoryId?: string;

  @ApiProperty({
    description: 'Sub-category name (optional)',
    required: false,
    example: 'Software Development',
  })
  subCategoryName?: string;
}

export class CompanyWithCategoriesDto extends Company {
  @ApiProperty({
    description: 'Company categories',
    type: [CompanyCategoryResponseDto],
  })
  categories: CompanyCategoryResponseDto[];
}
