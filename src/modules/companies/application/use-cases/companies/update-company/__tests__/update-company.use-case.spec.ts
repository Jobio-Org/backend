import { EntityNotFoundException } from '~modules/companies/application/exceptions/not-found.exception';
import { UpdateCompanyUseCase } from '~modules/companies/application/use-cases/companies/update-company/update-company.use-case';
import { Company } from '~modules/companies/domain/entities/company.entity';
import { type ICompanyCategoryRepository } from '~modules/companies/domain/repositories/company-category-repository.interface';
import { type ICompanyRepository } from '~modules/companies/domain/repositories/company-repository.interface';
import { type CompanyWithCategoriesService } from '~modules/companies/infrastructure/services/company-with-categories.service';

describe('UpdateCompanyUseCase', () => {
  let useCase: UpdateCompanyUseCase;
  let repository: jest.Mocked<ICompanyRepository>;
  let companyCategoryRepository: jest.Mocked<ICompanyCategoryRepository>;
  let companyWithCategoriesService: jest.Mocked<CompanyWithCategoriesService>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      save: jest.fn(),
    } as any;
    companyCategoryRepository = {
      deleteByCompanyId: jest.fn(),
      bulkInsert: jest.fn(),
    } as any;
    companyWithCategoriesService = {
      getCompanyWithCategories: jest.fn(),
    } as any;
    useCase = new UpdateCompanyUseCase(repository, companyCategoryRepository, companyWithCategoriesService);
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
    const result = await useCase.execute({ companyId: 'c1', name: 'Test', categories: [] } as any);
    expect(repository.findById).toHaveBeenCalledWith('c1');
    expect(repository.save).toHaveBeenCalled();
    expect(result).toBe(company);
  });

  it('should throw if company not found', async () => {
    repository.findById.mockResolvedValue(null);
    try {
      await useCase.execute({ companyId: 'c1', name: 'Test', categories: [] } as any);
      fail('Should throw');
    } catch (e) {
      expect(e).toBeInstanceOf(EntityNotFoundException);
      expect(e.message).toContain('company with id c1 not found');
    }
  });
});
