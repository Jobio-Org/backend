import { Inject, Injectable } from '@nestjs/common';

import { EntityNotFoundException } from '~modules/companies/application/exceptions/not-found.exception';
import {
  IGetCompanyCategoriesInput,
  IGetCompanyCategoriesOutput,
  IGetCompanyCategoriesUseCase,
} from '~modules/companies/application/use-cases/companies/get-company-categories/get-company-categories-use-case.interface';
import { CompaniesDiToken } from '~modules/companies/constants';
import { ICompanyCategoryRepository } from '~modules/companies/domain/repositories/company-category-repository.interface';
import { ICompanyRepository } from '~modules/companies/domain/repositories/company-repository.interface';

import { Query } from '~shared/application/CQS/query.abstract';

@Injectable()
export class GetCompanyCategoriesUseCase
  extends Query<IGetCompanyCategoriesInput, IGetCompanyCategoriesOutput>
  implements IGetCompanyCategoriesUseCase
{
  constructor(
    @Inject(CompaniesDiToken.COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
    @Inject(CompaniesDiToken.COMPANY_CATEGORY_REPOSITORY)
    private readonly companyCategoryRepository: ICompanyCategoryRepository,
  ) {
    super();
  }

  protected async implementation(): Promise<IGetCompanyCategoriesOutput> {
    const { companyId } = this._input;

    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw new EntityNotFoundException('company', companyId);
    }

    const categoriesWithNames = await this.companyCategoryRepository.findByCompanyIdWithNames(companyId);

    return {
      categories: categoriesWithNames,
    };
  }
}
