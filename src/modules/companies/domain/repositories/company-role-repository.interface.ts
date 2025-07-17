import { type CompanyRole } from '~modules/companies/domain/entities/company-role.entity';

import { type IBaseRepository } from '~shared/domain/repositories/base-repository.interface';

export interface ICompanyRoleRepository extends IBaseRepository<CompanyRole, string> {
  findAll(): Promise<CompanyRole[]>;
  deleteAll(): Promise<void>;
  findByName(name: string): Promise<CompanyRole | null>;
}
