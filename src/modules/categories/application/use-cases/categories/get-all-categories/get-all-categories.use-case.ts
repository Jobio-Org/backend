import { Inject, Injectable } from '@nestjs/common';

import { GetAllCategoriesDto } from '~modules/categories/application/dto/get-all-categories.dto';
import { IGetAllCategoriesUseCase } from '~modules/categories/application/use-cases/categories/get-all-categories/get-all-categories-use-case.interface';
import { CategoriesDiToken } from '~modules/categories/constants';
import { Category } from '~modules/categories/domain/entities/category.entity';
import {
  FindAllCategoriesInput,
  ICategoryRepository,
} from '~modules/categories/domain/repositories/category-repository.interface';

import { PaginatedQuery } from '~shared/application/CQS/paginated-query.abstract';

@Injectable()
export class GetAllCategoriesUseCase
  extends PaginatedQuery<GetAllCategoriesDto, Category>
  implements IGetAllCategoriesUseCase
{
  constructor(
    @Inject(CategoriesDiToken.CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {
    super();
  }

  protected async getItems(input: GetAllCategoriesDto): Promise<Category[]> {
    const repoInput: FindAllCategoriesInput = {
      page: input.page,
      limit: input.limit,
      name: input.name,
    };
    return this.categoryRepository.findAll(repoInput);
  }

  protected async getTotal(_input: GetAllCategoriesDto): Promise<number> {
    return this.categoryRepository.count();
  }

  protected getBaseUrl(_input: GetAllCategoriesDto): string {
    return '/categories';
  }
}
