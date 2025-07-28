import { type CompanyCategory } from '~modules/companies/domain/entities/company-category.entity';

import { type IBaseRepository } from '~shared/domain/repositories/base-repository.interface';

export interface CompanyCategoryWithNames {
  id: string;
  categoryId: string;
  categoryName: string;
  subCategoryId?: string;
  subCategoryName?: string;
  createdAt: Date;
}

export interface ICompanyCategoryRepository extends IBaseRepository<CompanyCategory, string> {
  findByCompanyId(companyId: string): Promise<CompanyCategory[]>;
  findByCompanyIdWithNames(companyId: string): Promise<CompanyCategoryWithNames[]>;
  deleteByCompanyId(companyId: string): Promise<void>;
  deleteByCompanyIdAndCategoryId(companyId: string, categoryId: string, subCategoryId?: string): Promise<void>;
  bulkInsert(entities: CompanyCategory[]): Promise<void>;
}
