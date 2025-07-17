import { UpdateCompanyDto } from '~modules/companies/application/dto/companies/update-company.dto';
import { Company } from '~modules/companies/domain/entities/company.entity';

import { IUseCase } from '~shared/application/use-cases/use-case.interface';

export type UpdateCompanyInput = UpdateCompanyDto & { companyId: string };

export interface IUpdateCompanyUseCase extends IUseCase<UpdateCompanyInput, Company> {}
