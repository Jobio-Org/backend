import { type Category } from '~modules/categories/domain/entities/category.entity';

import { type Query } from '~shared/application/CQS/query.abstract';
import { type PaginationQueryDto } from '~shared/application/dto/pagination.dto';
import { type PaginationResult } from '~shared/application/models/pagination.model';

export interface IGetAllCategoriesUseCase extends Query<PaginationQueryDto, PaginationResult<Category>> {}
