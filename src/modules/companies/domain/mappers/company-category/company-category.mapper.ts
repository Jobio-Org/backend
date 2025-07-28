import { Injectable } from '@nestjs/common';

import { CompanyCategory } from '~modules/companies/domain/entities/company-category.entity';

import { IDataAccessMapper } from '~shared/domain/mappers';

export interface ICompanyCategoryDataAccess {
  id: string;
  companyId: string;
  categoryId: string;
  subCategoryId: string;
  createdAt: Date;
}

@Injectable()
export class CompanyCategoryMapper implements IDataAccessMapper<CompanyCategory, ICompanyCategoryDataAccess> {
  public toDomain(persistence: ICompanyCategoryDataAccess): CompanyCategory {
    return CompanyCategory.builder(persistence.companyId, persistence.categoryId)
      .id(persistence.id)
      .companyId(null)
      .subCategoryId(persistence.subCategoryId || undefined)
      .createdAt(persistence.createdAt)
      .build();
  }

  public toPersistence(entity: CompanyCategory): ICompanyCategoryDataAccess {
    return {
      id: entity.id,
      companyId: entity.companyId,
      categoryId: entity.categoryId,
      subCategoryId: entity.subCategoryId,
      createdAt: entity.createdAt,
    };
  }
}
