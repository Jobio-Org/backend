import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { POSTGRES_DB } from '~lib/drizzle-postgres';

import { CompanyCategory } from '~modules/companies/domain/entities/company-category.entity';
import {
  CompanyCategoryMapper,
  ICompanyCategoryDataAccess,
} from '~modules/companies/domain/mappers/company-category/company-category.mapper';
import {
  CompanyCategoryWithNames,
  ICompanyCategoryRepository,
} from '~modules/companies/domain/repositories/company-category-repository.interface';

import { IDataAccessMapper } from '~shared/domain/mappers';
import {
  DrizzleRepository,
  TableDefinition,
} from '~shared/infrastructure/database/drizzle/repository/drizzle.repository';
import { MergedDbSchema } from '~shared/infrastructure/database/drizzle/schema';
import {
  category,
  companyCategory,
  subCategory,
} from '~shared/infrastructure/database/drizzle/schema/public-database-schema';

@Injectable()
export class DrizzleCompanyCategoryRepository
  extends DrizzleRepository<CompanyCategory, TableDefinition<typeof companyCategory>, ICompanyCategoryDataAccess>
  implements ICompanyCategoryRepository
{
  constructor(
    @Inject(POSTGRES_DB) db: NodePgDatabase<MergedDbSchema>,
    @Inject(CompanyCategoryMapper) mapper: IDataAccessMapper<CompanyCategory, ICompanyCategoryDataAccess>,
  ) {
    super(TableDefinition.create(companyCategory, 'id'), db, mapper);
  }

  async findByCompanyId(companyId: string): Promise<CompanyCategory[]> {
    const dbRecords = await this.db.select().from(companyCategory).where(eq(companyCategory.companyId, companyId));

    return dbRecords.map((record) => this.mapper.toDomain(record));
  }

  async findByCompanyIdWithNames(companyId: string): Promise<CompanyCategoryWithNames[]> {
    const dbRecords = await this.db
      .select({
        id: companyCategory.id,
        categoryId: companyCategory.categoryId,
        categoryName: category.name,
        subCategoryId: companyCategory.subCategoryId,
        subCategoryName: subCategory.name,
        createdAt: companyCategory.createdAt,
      })
      .from(companyCategory)
      .leftJoin(category, eq(companyCategory.categoryId, category.id))
      .leftJoin(subCategory, eq(companyCategory.subCategoryId, subCategory.id))
      .where(eq(companyCategory.companyId, companyId));

    return dbRecords.map((record) => ({
      id: record.id,
      categoryId: record.categoryId,
      categoryName: record.categoryName,
      subCategoryId: record.subCategoryId || undefined,
      subCategoryName: record.subCategoryName || undefined,
      createdAt: record.createdAt,
    }));
  }

  async deleteByCompanyId(companyId: string): Promise<void> {
    await this.db.delete(companyCategory).where(eq(companyCategory.companyId, companyId));
  }

  async deleteByCompanyIdAndCategoryId(companyId: string, categoryId: string, subCategoryId?: string): Promise<void> {
    const conditions = [eq(companyCategory.companyId, companyId), eq(companyCategory.categoryId, categoryId)];

    if (subCategoryId) {
      conditions.push(eq(companyCategory.subCategoryId, subCategoryId));
    }

    await this.db.delete(companyCategory).where(and(...conditions));
  }

  async bulkInsert(entities: CompanyCategory[]): Promise<void> {
    if (entities.length === 0) return;

    await this.db.insert(companyCategory).values(entities.map((entity) => this.mapper.toPersistence(entity)));
  }
}
