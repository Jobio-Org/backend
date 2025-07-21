import { EntityNotFoundException } from '~modules/companies/application/exceptions/not-found.exception';
import { Company } from '~modules/companies/domain/entities/company.entity';
import { type ICompanyRepository } from '~modules/companies/domain/repositories/company-repository.interface';

import { UpdateCompanyUseCase } from '../update-company.use-case';

describe('UpdateCompanyUseCase', () => {
  let useCase: UpdateCompanyUseCase;
  let repository: jest.Mocked<ICompanyRepository>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      save: jest.fn(),
    } as any;
    useCase = new UpdateCompanyUseCase(repository);
    useCase['_dbContext'] = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
    } as any;
    useCase['_eventDispatcher'] = {
      dispatchEvents: jest.fn(),
    } as any;
  });

  it('should update company', async () => {
    const company = Company.builder('Test').id('c1').build();
    repository.findById.mockResolvedValue(company);
    repository.save.mockResolvedValue(company);
    const result = await useCase.execute({ companyId: 'c1', name: 'Test' } as any);
    expect(repository.findById).toHaveBeenCalledWith('c1');
    expect(repository.save).toHaveBeenCalled();
    expect(result).toBe(company);
  });

  it('should throw if company not found', async () => {
    repository.findById.mockResolvedValue(null);
    try {
      await useCase.execute({ companyId: 'c1', name: 'Test' } as any);
      fail('Should throw');
    } catch (e) {
      expect(e).toBeInstanceOf(EntityNotFoundException);
      expect(e.message).toContain('company with id c1 not found');
    }
  });
});
