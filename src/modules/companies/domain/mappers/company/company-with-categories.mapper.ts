import { Injectable } from '@nestjs/common';

import { CompanyWithCategoriesDto } from '~modules/companies/application/dto/company-categories/company-category.dto';
import { CompanyCategory } from '~modules/companies/domain/entities/company-category.entity';
import { CompanyCategoryMapper } from '~modules/companies/domain/mappers/company-category/company-category.mapper';
import { CompanyMapper, ICompanyDataAccess } from '~modules/companies/domain/mappers/company/company.mapper';
import { CompanyCategoryWithNames } from '~modules/companies/domain/repositories/company-category-repository.interface';

import { IDataAccessMapper } from '~shared/domain/mappers/data-access-mapper.interface';

export interface ICompanyWithCategoriesDataAccess {
  company: ICompanyDataAccess;
  categories: CompanyCategoryWithNames[];
}

@Injectable()
export class CompanyWithCategoriesMapper
  implements IDataAccessMapper<CompanyWithCategoriesDto, ICompanyWithCategoriesDataAccess>
{
  constructor(
    private readonly companyMapper: CompanyMapper,
    private readonly companyCategoryMapper: CompanyCategoryMapper,
  ) {}

  toDomain(dataAccess: ICompanyWithCategoriesDataAccess): CompanyWithCategoriesDto {
    const company = this.companyMapper.toDomain(dataAccess.company);

    return {
      id: company.id,
      name: company.name,
      description: company.description,
      website: company.website,
      logo: company.logo,
      size: company.size,
      location: company.location,
      isActive: company.isActive,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
      categories: dataAccess.categories,
    };
  }

  toPersistence(domain: CompanyWithCategoriesDto): ICompanyWithCategoriesDataAccess {
    const companyData = this.companyMapper.toPersistence(domain);

    const categoriesData = domain.categories.map((categoryDto) => {
      const category = CompanyCategory.builder(domain.id, categoryDto.categoryId)
        .subCategoryId(categoryDto.subCategoryId)
        .build();

      return {
        ...this.companyCategoryMapper.toPersistence(category),
        categoryName: categoryDto.categoryName,
        subCategoryName: categoryDto.subCategoryName,
      };
    });

    return {
      company: companyData,
      categories: categoriesData,
    };
  }
}
