import { type Company } from '~modules/companies/domain/entities/company.entity';

import { type IBaseRepository } from '~shared/domain/repositories/base-repository.interface';

export interface ICompanyRepository extends IBaseRepository<Company, string> {
  findAllPaginated(query: FindAllWithUserCompanyPaginatedInput): Promise<FindAllWithUserCompanyPaginatedOutput>;
  count(): Promise<number>;
  findAllByRecruiterProfileIdPaginated(
    query: FindAllByRecruiterProfileIdPaginatedInput,
  ): Promise<FindAllByRecruiterProfileIdPaginatedOutput>;
  findByName(name: string): Promise<Company | null>;
  findBySlug(slug: string): Promise<Company | null>;
  existsBySlug(slug: string): Promise<boolean>;
}

export interface FindAllWithUserCompanyPaginatedInput {
  page?: number;
  limit?: number;
  name?: string;
}

export interface FindAllWithUserCompanyPaginatedOutput {
  results: Array<Company>;
  total: number;
}

export interface FindAllByRecruiterProfileIdPaginatedInput {
  recruiterProfileId: string;
  page?: number;
  limit?: number;
  name?: string;
}

export interface FindAllByRecruiterProfileIdPaginatedOutput {
  results: Company[];
  total: number;
}
