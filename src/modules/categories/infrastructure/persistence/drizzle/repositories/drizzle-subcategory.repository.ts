import { Inject, Injectable } from '@nestjs/common';
import { and, count, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { POSTGRES_DB } from '~lib/drizzle-postgres';

import { SubCategory } from '~modules/categories/domain/entities/subcategory.entity';
import {
  ISubCategoryDataAccess,
  SubCategoryMapper,
} from '~modules/categories/domain/mappers/subcategory/subcategory.mapper';
import {
  FindAllSubCategoriesInput,
  ISubCategoryRepository,
} from '~modules/categories/domain/repositories/subcategory-repository.interface';

import { IDataAccessMapper } from '~shared/domain/mappers';
import {
  DrizzleRepository,
  TableDefinition,
} from '~shared/infrastructure/database/drizzle/repository/drizzle.repository';
import { MergedDbSchema } from '~shared/infrastructure/database/drizzle/schema';
import { subCategory } from '~shared/infrastructure/database/drizzle/schema/public-database-schema';

@Injectable()
export class DrizzleSubCategoryRepository
  extends DrizzleRepository<SubCategory, TableDefinition<typeof subCategory>, ISubCategoryDataAccess>
  implements ISubCategoryRepository
{
  constructor(
    @Inject(POSTGRES_DB) db: NodePgDatabase<MergedDbSchema>,
    @Inject(SubCategoryMapper) mapper: IDataAccessMapper<SubCategory, ISubCategoryDataAccess>,
  ) {
    super(TableDefinition.create(subCategory, 'id'), db, mapper);
  }

  public async findAll(query: FindAllSubCategoriesInput): Promise<SubCategory[]> {
    const { page = 1, limit = 10, name, categoryId } = query;
    const offset = (page - 1) * limit;
    let where;
    if (name && categoryId) {
      where = and(eq(subCategory.name, name), eq(subCategory.categoryId, categoryId));
    } else if (name) {
      where = eq(subCategory.name, name);
    } else if (categoryId) {
      where = eq(subCategory.categoryId, categoryId);
    }
    const result = await this.db.select().from(subCategory).where(where).limit(limit).offset(offset);
    return result.map((item) => this.mapper.toDomain(item));
  }

  public async findByName(name: string): Promise<SubCategory | null> {
    const [result] = await this.db.select().from(subCategory).where(eq(subCategory.name, name)).limit(1);

    if (!result) return null;

    return this.mapper.toDomain(result);
  }

  public async findByCategoryId(categoryId: string, query: FindAllSubCategoriesInput): Promise<SubCategory[]> {
    const { page = 1, limit = 10, name } = query;
    const offset = (page - 1) * limit;
    let where = eq(subCategory.categoryId, categoryId);
    if (name) {
      where = and(eq(subCategory.categoryId, categoryId), eq(subCategory.name, name));
    }
    const result = await this.db.select().from(subCategory).where(where).limit(limit).offset(offset);
    return result.map((item) => this.mapper.toDomain(item));
  }

  public async count(): Promise<number> {
    const [result] = await this.db.select({ count: count() }).from(subCategory);
    return result.count ?? 0;
  }

  public async countByCategoryId(categoryId: string): Promise<number> {
    const result = await this.db.select().from(subCategory).where(eq(subCategory.categoryId, categoryId));
    return result.length;
  }
}
