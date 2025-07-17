import { type CreateUserCompanyDto } from '~modules/companies/application/dto/user-companies/create-user-company.dto';
import { type UserCompany } from '~modules/companies/domain/entities/user-company.entity';

import { type IUseCase } from '~shared/application/use-cases/use-case.interface';

export interface ICreateUserCompanyUseCase extends IUseCase<CreateUserCompanyDto, UserCompany> {}
