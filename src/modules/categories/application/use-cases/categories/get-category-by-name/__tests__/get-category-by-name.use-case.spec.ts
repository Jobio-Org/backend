import { EntityNotFoundByNameException } from '~modules/categories/application/exceptions/not-found-by-name.exception';
import { type Category } from '~modules/categories/domain/entities/category.entity';
import { type ICategoryRepository } from '~modules/categories/domain/repositories/category-repository.interface';

import { GetCategoryByNameUseCase } from '../get-category-by-name.use-case';

describe('GetCategoryByNameUseCase', () => {
  let useCase: GetCategoryByNameUseCase;
  let repository: jest.Mocked<ICategoryRepository>;

  beforeEach(() => {
    repository = {
      findByName: jest.fn(),
    } as any;
    useCase = new GetCategoryByNameUseCase(repository);
  });

  it('should return category if found', async () => {
    const category = { id: 'c1', name: 'cat' } as Category;
    repository.findByName.mockResolvedValue(category);
    const result = await useCase.execute({ name: 'cat' });
    expect(result).toBe(category);
  });

  it('should throw if not found', async () => {
    repository.findByName.mockResolvedValue(null);
    try {
      await useCase.execute({ name: 'cat' });
      fail('Should throw');
    } catch (e) {
      expect(e).toBeInstanceOf(EntityNotFoundByNameException);
    }
  });
});
