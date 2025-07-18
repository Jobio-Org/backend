import { type SubCategory } from '~modules/categories/domain/entities/subcategory.entity';

import { type IBaseRepository } from '~shared/domain/repositories/base-repository.interface';

export interface FindAllSubCategoriesInput {
  page?: number;
  limit?: number;
  name?: string;
  categoryId?: string;
}

export interface ISubCategoryRepository extends IBaseRepository<SubCategory, string> {
  findByName(name: string): Promise<SubCategory | null>;
  findByCategoryId(categoryId: string, query: FindAllSubCategoriesInput): Promise<SubCategory[]>;
  findAll(query: FindAllSubCategoriesInput): Promise<SubCategory[]>;
  count(): Promise<number>;
  countByCategoryId(categoryId: string): Promise<number>;
}
