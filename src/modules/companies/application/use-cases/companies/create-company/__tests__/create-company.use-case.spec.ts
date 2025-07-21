import { Company } from '~modules/companies/domain/entities/company.entity';
import { type ICompanyRepository } from '~modules/companies/domain/repositories/company-repository.interface';

import { CreateCompanyUseCase } from '../create-company.use-case';

describe('CreateCompanyUseCase', () => {
  let useCase: CreateCompanyUseCase;
  let repository: jest.Mocked<ICompanyRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
    } as any;
    useCase = new CreateCompanyUseCase(repository);
    useCase['_dbContext'] = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
    } as any;
    useCase['_eventDispatcher'] = {
      dispatchEvents: jest.fn(),
    } as any;
  });

  it('should create company', async () => {
    const company = Company.builder('Test').build();
    repository.create.mockResolvedValue(company);
    const result = await useCase.execute({ name: 'Test' } as any);
    expect(repository.create).toHaveBeenCalled();
    expect(result).toBe(company);
  });
});
