import { type CreateCompanyDto } from '~modules/companies/application/dto/companies/create-company.dto';
import { type Company } from '~modules/companies/domain/entities/company.entity';

import { type IUseCase } from '~shared/application/use-cases/use-case.interface';

export interface ICreateCompanyUseCase extends IUseCase<CreateCompanyDto, Company> {}
