import { type SubCategory } from '~modules/categories/domain/entities/subcategory.entity';

import { type Query } from '~shared/application/CQS/query.abstract';
import { type PaginationQueryDto } from '~shared/application/dto/pagination.dto';
import { type PaginationResult } from '~shared/application/models/pagination.model';

export interface GetSubcategoriesByCategoryIdInput extends PaginationQueryDto {
  categoryId: string;
}

export interface IGetSubcategoriesByCategoryIdUseCase
  extends Query<GetSubcategoriesByCategoryIdInput, PaginationResult<SubCategory>> {}
