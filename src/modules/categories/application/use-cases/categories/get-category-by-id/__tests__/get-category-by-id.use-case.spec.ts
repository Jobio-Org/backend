import { EntityNotFoundByIdException } from '~modules/categories/application/exceptions/not-found-by-id.exception';
import { type Category } from '~modules/categories/domain/entities/category.entity';
import { type ICategoryRepository } from '~modules/categories/domain/repositories/category-repository.interface';

import { GetCategoryByIdUseCase } from '../get-category-by-id.use-case';

describe('GetCategoryByIdUseCase', () => {
  let useCase: GetCategoryByIdUseCase;
  let repository: jest.Mocked<ICategoryRepository>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
    } as any;
    useCase = new GetCategoryByIdUseCase(repository);
  });

  it('should return category if found', async () => {
    const category = { id: 'c1', name: 'cat' } as Category;
    repository.findById.mockResolvedValue(category);
    const result = await useCase.execute({ id: 'c1' });
    expect(result).toBe(category);
  });

  it('should throw if not found', async () => {
    repository.findById.mockResolvedValue(null);
    try {
      await useCase.execute({ id: 'c1' });
      fail('Should throw');
    } catch (e) {
      expect(e).toBeInstanceOf(EntityNotFoundByIdException);
    }
  });
});
