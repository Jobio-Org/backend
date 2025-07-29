import { type Company } from '~modules/companies/domain/entities/company.entity';

export interface IGetCompanyBySlugUseCase {
  execute(slug: string): Promise<Company>;
}
