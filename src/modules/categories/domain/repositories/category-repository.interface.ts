import { type Category } from '~modules/categories/domain/entities/category.entity';

import { type PaginationQueryDto } from '~shared/application/dto/pagination.dto';
import { type IBaseRepository } from '~shared/domain/repositories/base-repository.interface';

export interface ICategoryRepository extends IBaseRepository<Category, string> {
  findByName(name: string): Promise<Category | null>;
  findAll(query: PaginationQueryDto): Promise<Category[]>;
  count(): Promise<number>;
}
