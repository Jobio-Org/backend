import { type Category } from '~modules/categories/domain/entities/category.entity';

import { type IBaseRepository } from '~shared/domain/repositories/base-repository.interface';

export interface FindAllCategoriesInput {
  page?: number;
  limit?: number;
  name?: string;
}

export interface ICategoryRepository extends IBaseRepository<Category, string> {
  findByName(name: string): Promise<Category | null>;
  findAll(query: FindAllCategoriesInput): Promise<Category[]>;
  count(): Promise<number>;
}
