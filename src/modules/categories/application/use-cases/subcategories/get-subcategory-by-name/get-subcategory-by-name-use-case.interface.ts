import { type SubCategory } from '~modules/categories/domain/entities/subcategory.entity';

import { type Query } from '~shared/application/CQS/query.abstract';

export interface IGetSubcategoryByNameUseCase extends Query<{ name: string }, SubCategory> {}
