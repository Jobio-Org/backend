import { CreateCompanyDto } from '../../../dto/companies/create-company.dto';

import { IUseCase } from '~shared/application/use-cases/use-case.interface';

import { Company } from '~modules/companies/domain/entities/company.entity';

export interface ICreateCompanyUseCase extends IUseCase<CreateCompanyDto, Company> {} 