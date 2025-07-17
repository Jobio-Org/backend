import { type UpdateCompanyDto } from '~modules/companies/application/dto/companies/update-company.dto';
import { type Company } from '~modules/companies/domain/entities/company.entity';

import { type IUseCase } from '~shared/application/use-cases/use-case.interface';

export type UpdateCompanyInput = UpdateCompanyDto & { companyId: string };

export interface IUpdateCompanyUseCase extends IUseCase<UpdateCompanyInput, Company> {}
