import { Company } from '~modules/companies/domain/entities/company.entity';
import { type ICompanyRepository } from '~modules/companies/domain/repositories/company-repository.interface';

import { GetCompaniesByRecruiterUseCase } from '../get-companies-by-recruiter.use-case';

describe('GetCompaniesByRecruiterUseCase', () => {
  let useCase: GetCompaniesByRecruiterUseCase;
  let repository: jest.Mocked<ICompanyRepository>;

  beforeEach(() => {
    repository = {
      findAllByRecruiterProfileIdPaginated: jest.fn(),
    } as any;
    useCase = new GetCompaniesByRecruiterUseCase(repository);
  });

  it('should return companies from getItems', async () => {
    const companies = [Company.builder('Test').build()];
    repository.findAllByRecruiterProfileIdPaginated.mockResolvedValue({ results: companies, total: 1 });
    const result = await useCase['getItems']({ recruiterProfileId: 'r1', page: 1, limit: 10 } as any);
    expect(result).toEqual(companies);
  });

  it('should return total from getTotal', async () => {
    repository.findAllByRecruiterProfileIdPaginated.mockResolvedValue({ results: [], total: 3 });
    const result = await useCase['getTotal']({ recruiterProfileId: 'r1', page: 1, limit: 10 } as any);
    expect(result).toBe(3);
  });
});
