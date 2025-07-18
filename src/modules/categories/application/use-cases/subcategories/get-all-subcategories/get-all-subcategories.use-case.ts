import { Inject, Injectable } from '@nestjs/common';

import { IGetAllSubcategoriesUseCase } from '~modules/categories/application/use-cases/subcategories/get-all-subcategories/get-all-subcategories-use-case.interface';
import { CategoriesDiToken } from '~modules/categories/constants';
import { SubCategory } from '~modules/categories/domain/entities/subcategory.entity';
import { ISubCategoryRepository, FindAllSubCategoriesInput } from '~modules/categories/domain/repositories/subcategory-repository.interface';
import { GetAllSubCategoriesDto } from '~modules/categories/application/dto/get-all-subcategories.dto';

import { PaginatedQuery } from '~shared/application/CQS/paginated-query.abstract';

@Injectable()
export class GetAllSubcategoriesUseCase
  extends PaginatedQuery<GetAllSubCategoriesDto, SubCategory>
  implements IGetAllSubcategoriesUseCase
{
  constructor(
    @Inject(CategoriesDiToken.SUB_CATEGORY_REPOSITORY)
    private readonly subCategoryRepository: ISubCategoryRepository,
  ) {
    super();
  }

  protected async getItems(input: GetAllSubCategoriesDto): Promise<SubCategory[]> {
    const repoInput: FindAllSubCategoriesInput = {
      page: input.page,
      limit: input.limit,
      name: input.name,
      categoryId: input.categoryId,
    };
    return this.subCategoryRepository.findAll(repoInput);
  }

  protected async getTotal(_input: GetAllSubCategoriesDto): Promise<number> {
    return this.subCategoryRepository.count();
  }

  protected getBaseUrl(_input: GetAllSubCategoriesDto): string {
    return '/subcategories';
  }
}
