import { type UpdateCompanyDto } from '~modules/companies/application/dto/companies/update-company.dto';
import { type CompanyWithCategoriesDto } from '~modules/companies/application/dto/company-categories/company-category.dto';

import { type IUseCase } from '~shared/application/use-cases/use-case.interface';

export type UpdateCompanyInput = UpdateCompanyDto & { companyId: string };

export interface IUpdateCompanyUseCase extends IUseCase<UpdateCompanyInput, CompanyWithCategoriesDto> {}
