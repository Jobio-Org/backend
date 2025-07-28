import { Inject, Injectable } from '@nestjs/common';

import { CompanyWithCategoriesDto } from '~modules/companies/application/dto/companies/company-category.dto';
import { EntityNotFoundException } from '~modules/companies/application/exceptions/not-found.exception';
import { CompaniesDiToken } from '~modules/companies/constants';
import {
  CompanyWithCategoriesMapper,
  ICompanyWithCategoriesDataAccess,
} from '~modules/companies/domain/mappers/company/company-with-categories.mapper';
import { ICompanyCategoryRepository } from '~modules/companies/domain/repositories/company-category-repository.interface';
import { ICompanyRepository } from '~modules/companies/domain/repositories/company-repository.interface';

@Injectable()
export class CompanyWithCategoriesService {
  constructor(
    @Inject(CompaniesDiToken.COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
    @Inject(CompaniesDiToken.COMPANY_CATEGORY_REPOSITORY)
    private readonly companyCategoryRepository: ICompanyCategoryRepository,
    private readonly companyWithCategoriesMapper: CompanyWithCategoriesMapper,
  ) {}

  async getCompanyWithCategories(companyId: string): Promise<CompanyWithCategoriesDto> {
    const company = await this.companyRepository.findById(companyId);

    if (!company) {
      throw new EntityNotFoundException('company', companyId);
    }

    const categoriesWithNames = await this.companyCategoryRepository.findByCompanyIdWithNames(companyId);

    const dataAccess: ICompanyWithCategoriesDataAccess = {
      company: {
        id: company.id,
        name: company.name,
        description: company.description,
        website: company.website,
        logo: company.logo,
        industry: company.industry,
        size: company.size,
        location: company.location,
        isActive: company.isActive,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
      },
      categories: categoriesWithNames,
    };

    return this.companyWithCategoriesMapper.toDomain(dataAccess);
  }
}
