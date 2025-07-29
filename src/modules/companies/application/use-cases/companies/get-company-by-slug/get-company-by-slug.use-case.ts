import { Inject, Injectable } from '@nestjs/common';

import { CompanyWithCategoriesDto } from '~modules/companies/application/dto/company-categories/company-category.dto';
import { EntityNotFoundException } from '~modules/companies/application/exceptions/not-found.exception';
import { IGetCompanyBySlugUseCase } from '~modules/companies/application/use-cases/companies/get-company-by-slug/get-company-by-slug-use-case.interface';
import { CompaniesDiToken } from '~modules/companies/constants';
import { Company } from '~modules/companies/domain/entities/company.entity';
import { ICompanyCategoryRepository } from '~modules/companies/domain/repositories/company-category-repository.interface';
import { ICompanyRepository } from '~modules/companies/domain/repositories/company-repository.interface';

import { Query } from '~shared/application/CQS/query.abstract';

@Injectable()
export class GetCompanyBySlugUseCase extends Query<string, Company> implements IGetCompanyBySlugUseCase {
  constructor(
    @Inject(CompaniesDiToken.COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
    @Inject(CompaniesDiToken.COMPANY_CATEGORY_REPOSITORY)
    private readonly companyCategoryRepository: ICompanyCategoryRepository,
  ) {
    super();
  }

  protected async implementation(): Promise<CompanyWithCategoriesDto> {
    const slug = this._input;

    const company = await this.companyRepository.findBySlug(slug);

    if (!company) {
      throw new EntityNotFoundException('company', slug);
    }

    const categories = await this.companyCategoryRepository.findByCompanyIdWithNames(company.id);

    return {
      ...company,
      categories,
    };
  }
}
