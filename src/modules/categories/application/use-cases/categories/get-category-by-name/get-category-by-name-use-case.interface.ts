import { type Category } from '~modules/categories/domain/entities/category.entity';

import { type Query } from '~shared/application/CQS/query.abstract';

export interface IGetCategoryByNameUseCase extends Query<{ name: string }, Category> {}
