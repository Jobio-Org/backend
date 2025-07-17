import { type IBaseRepository } from '~shared/domain/repositories/base-repository.interface';

import { type UserCompany } from '../entities/user-company.entity';

export interface IUserCompanyRepository extends IBaseRepository<UserCompany, string> {
  findByRecruiterProfileId(recruiterProfileId: string): Promise<UserCompany[]>;
  findByCompanyId(companyId: string): Promise<UserCompany[]>;
  findByRecruiterProfileIdAndCompanyId(recruiterProfileId: string, companyId: string): Promise<UserCompany | null>;
  existsByRecruiterProfileIdAndCompanyId(recruiterProfileId: string, companyId: string): Promise<boolean>;
}
