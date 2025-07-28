import { EntityNotFoundException } from '~modules/companies/application/exceptions/not-found.exception';
import { GetCompanyCategoriesUseCase } from '~modules/companies/application/use-cases/companies/get-company-categories/get-company-categories.use-case';
import {
  type CompanyCategoryWithNames,
  type ICompanyCategoryRepository,
} from '~modules/companies/domain/repositories/company-category-repository.interface';
import { type ICompanyRepository } from '~modules/companies/domain/repositories/company-repository.interface';

describe('GetCompanyCategoriesUseCase', () => {
  let useCase: GetCompanyCategoriesUseCase;
  let companyCategoryRepository: jest.Mocked<ICompanyCategoryRepository>;
  let companyRepository: jest.Mocked<ICompanyRepository>;

  beforeEach(() => {
    companyCategoryRepository = {
      findByCompanyIdWithNames: jest.fn(),
    } as any;
    companyRepository = {
      findById: jest.fn(),
    } as any;
    useCase = new GetCompanyCategoriesUseCase(companyRepository, companyCategoryRepository);
  });

  it('should return categories from getItems', async () => {
    const categories: CompanyCategoryWithNames[] = [
      {
        id: '1',
        categoryId: '1',
        categoryName: 'Category 1',
        subCategoryId: '1',
        subCategoryName: 'Subcategory 1',
        createdAt: new Date(),
      },
    ];
    companyCategoryRepository.findByCompanyIdWithNames.mockResolvedValue(categories);
    const result = await useCase['getItems']({ companyId: '1' } as any);
    expect(result).toEqual(categories);
  });

  it('should throw an error if the company is not found', async () => {
    companyRepository.findById.mockResolvedValue(null);
    await expect(useCase['getItems']({ companyId: '1' } as any)).rejects.toThrow(EntityNotFoundException);
  });
});
