import { type CompanyCategoryWithNames } from '~modules/companies/domain/repositories/company-category-repository.interface';

import { type IUseCase } from '~shared/application/use-cases/use-case.interface';

export interface IGetCompanyCategoriesInput {
  companyId: string;
}

export interface IGetCompanyCategoriesOutput {
  categories: CompanyCategoryWithNames[];
}

export interface IGetCompanyCategoriesUseCase
  extends IUseCase<IGetCompanyCategoriesInput, IGetCompanyCategoriesOutput> {}
