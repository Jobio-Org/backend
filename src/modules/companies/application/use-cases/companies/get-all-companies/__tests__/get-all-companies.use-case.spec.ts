import { Company } from '~modules/companies/domain/entities/company.entity';
import { type ICompanyRepository } from '~modules/companies/domain/repositories/company-repository.interface';

import { GetAllCompaniesUseCase } from '../get-all-companies.use-case';

describe('GetAllCompaniesUseCase', () => {
  let useCase: GetAllCompaniesUseCase;
  let repository: jest.Mocked<ICompanyRepository>;

  beforeEach(() => {
    repository = {
      findAllPaginated: jest.fn(),
      count: jest.fn(),
    } as any;
    useCase = new GetAllCompaniesUseCase(repository);
  });

  it('should return companies from getItems', async () => {
    const companies = [Company.builder('Test').build()];
    repository.findAllPaginated.mockResolvedValue({ results: companies, total: 1 });
    const result = await useCase['getItems']({ page: 1, limit: 10 } as any);
    expect(result).toEqual(companies);
  });

  it('should return total from getTotal with name', async () => {
    repository.findAllPaginated.mockResolvedValue({ results: [], total: 5 });
    const result = await useCase['getTotal']({ page: 1, limit: 10, name: 'A' } as any);
    expect(result).toBe(5);
  });

  it('should return total from count if no name', async () => {
    repository.count.mockResolvedValue(7);
    const result = await useCase['getTotal']({ page: 1, limit: 10 } as any);
    expect(result).toBe(7);
  });
});
