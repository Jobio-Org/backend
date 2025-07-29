import { Inject, Injectable } from '@nestjs/common';
import { and, count, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { POSTGRES_DB } from '~lib/drizzle-postgres';

import { Company } from '~modules/companies/domain/entities/company.entity';
import { CompanyMapper, ICompanyDataAccess } from '~modules/companies/domain/mappers/company/company.mapper';
import {
  FindAllByRecruiterProfileIdPaginatedInput,
  FindAllByRecruiterProfileIdPaginatedOutput,
  FindAllWithUserCompanyPaginatedOutput,
  ICompanyRepository,
} from '~modules/companies/domain/repositories/company-repository.interface';
import { FindAllWithUserCompanyPaginatedInput } from '~modules/companies/domain/repositories/company-repository.interface';

import { IDataAccessMapper } from '~shared/domain/mappers';
import {
  DrizzleRepository,
  TableDefinition,
} from '~shared/infrastructure/database/drizzle/repository/drizzle.repository';
import { MergedDbSchema } from '~shared/infrastructure/database/drizzle/schema';
import { company, userCompany } from '~shared/infrastructure/database/drizzle/schema/public-database-schema';

@Injectable()
export class DrizzleCompanyRepository
  extends DrizzleRepository<Company, TableDefinition<typeof company>, ICompanyDataAccess>
  implements ICompanyRepository
{
  constructor(
    @Inject(POSTGRES_DB) db: NodePgDatabase<MergedDbSchema>,
    @Inject(CompanyMapper) mapper: IDataAccessMapper<Company, ICompanyDataAccess>,
  ) {
    super(TableDefinition.create(company, 'id'), db, mapper);
  }

  async findAll(): Promise<Company[]> {
    const result = await this.db.select().from(company);
    return result.map((item) => this.mapper.toDomain(item));
  }

  public async findByName(name: string): Promise<Company | null> {
    const [result] = await this.db.select().from(company).where(eq(company.name, name)).limit(1);

    if (!result) return null;

    return this.mapper.toDomain(result);
  }

  public async findBySlug(slug: string): Promise<Company | null> {
    const [result] = await this.db.select().from(company).where(eq(company.slug, slug)).limit(1);

    if (!result) return null;

    return this.mapper.toDomain(result);
  }

  public async existsBySlug(slug: string): Promise<boolean> {
    const [result] = await this.db.select({ exists: count() }).from(company).where(eq(company.slug, slug)).limit(1);

    return (result?.exists ?? 0) > 0;
  }

  public async count(): Promise<number> {
    const [result] = await this.db.select({ count: count() }).from(company);
    return result.count ?? 0;
  }

  public async findAllPaginated(
    query: FindAllWithUserCompanyPaginatedInput,
  ): Promise<FindAllWithUserCompanyPaginatedOutput> {
    const { page = 1, limit = 10, name } = query;
    const offset = (page - 1) * limit;
    const where = name ? eq(company.name, name) : undefined;

    const [results, totalResult] = await Promise.all([
      this.db.select().from(company).where(where).limit(limit).offset(offset),
      this.db.select({ count: count() }).from(company).where(where),
    ]);

    const total = totalResult[0]?.count ? Number(totalResult[0].count) : 0;

    return {
      results: results.map((row) => this.mapper.toDomain(row)),
      total,
    };
  }

  public async findAllByRecruiterProfileIdPaginated(
    query: FindAllByRecruiterProfileIdPaginatedInput,
  ): Promise<FindAllByRecruiterProfileIdPaginatedOutput> {
    const { recruiterProfileId, page = 1, limit = 10, name } = query;

    const offset = (page - 1) * limit;
    const where = [eq(userCompany.recruiterProfileId, recruiterProfileId)];

    if (name) {
      where.push(eq(company.name, name));
    }

    const andWhere = where.length > 1 ? and(...where) : where[0];

    const [results, totalResult] = await Promise.all([
      this.db
        .select({ company })
        .from(userCompany)
        .innerJoin(company, eq(userCompany.companyId, company.id))
        .where(andWhere)
        .limit(limit)
        .offset(offset),
      this.db
        .select({ count: count() })
        .from(userCompany)
        .innerJoin(company, eq(userCompany.companyId, company.id))
        .where(andWhere),
    ]);

    const total = totalResult[0]?.count ? Number(totalResult[0].count) : 0;

    return {
      results: results.map((row) => this.mapper.toDomain(row.company)),
      total,
    };
  }
}
