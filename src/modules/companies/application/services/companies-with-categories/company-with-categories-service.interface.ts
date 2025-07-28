import { type CompanyWithCategoriesDto } from '~modules/companies/application/dto/company-categories/company-category.dto';

export interface ICompanyWithCategoriesService {
  getCompanyWithCategories(companyId: string): Promise<CompanyWithCategoriesDto>;
}
