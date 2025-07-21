import { type Category } from '~modules/categories/domain/entities/category.entity';
import { type ICategoryRepository } from '~modules/categories/domain/repositories/category-repository.interface';

import { GetAllCategoriesUseCase } from '../get-all-categories.use-case';

describe('GetAllCategoriesUseCase', () => {
  let useCase: GetAllCategoriesUseCase;
  let repository: jest.Mocked<ICategoryRepository>;

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      count: jest.fn(),
    } as any;
    useCase = new GetAllCategoriesUseCase(repository);
  });

  it('should return categories from getItems', async () => {
    const categories = [{ id: 'c1', name: 'cat' } as Category];
    repository.findAll.mockResolvedValue(categories);
    const result = await useCase['getItems']({ page: 1, limit: 10 } as any);
    expect(result).toEqual(categories);
  });

  it('should return total from getTotal', async () => {
    repository.count.mockResolvedValue(5);
    const result = await useCase['getTotal']({ page: 1, limit: 10 } as any);
    expect(result).toBe(5);
  });
});
