import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { POSTGRES_DB } from '~lib/drizzle-postgres';
import { CompanyInvitation } from '~modules/companies/domain/entities/company-invitation.entity';
import {
  CompanyInvitationMapper,
  ICompanyInvitationDataAccess,
} from '~modules/companies/domain/mappers/company-invitation/company-invitation.mapper';
import { ICompanyInvitationRepository } from '~modules/companies/domain/repositories/company-invitation-repository.interface';
import { IDataAccessMapper } from '~shared/domain/mappers';
import {
  DrizzleRepository,
  TableDefinition,
} from '~shared/infrastructure/database/drizzle/repository/drizzle.repository';
import { MergedDbSchema } from '~shared/infrastructure/database/drizzle/schema';
import { companyInvitation } from '~shared/infrastructure/database/drizzle/schema/public-database-schema';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class DrizzleCompanyInvitationRepository
  extends DrizzleRepository<CompanyInvitation, TableDefinition<typeof companyInvitation>, ICompanyInvitationDataAccess>
  implements ICompanyInvitationRepository
{
  constructor(
    @Inject(POSTGRES_DB) db: NodePgDatabase<MergedDbSchema>,
    @Inject(CompanyInvitationMapper) mapper: IDataAccessMapper<CompanyInvitation, ICompanyInvitationDataAccess>,
  ) {
    super(TableDefinition.create(companyInvitation, 'id'), db, mapper);
  }

  async create(invitation: Partial<CompanyInvitation>): Promise<CompanyInvitation> {
    const data = this.mapper.toPersistence(invitation as CompanyInvitation);

    const [created] = await this.db
      .insert(companyInvitation)
      .values(data)
      .returning();
      
    return this.mapper.toDomain(created);
  }

  async findPendingByEmailAndCompany(email: string, companyId: string): Promise<CompanyInvitation | null> {
    const [result] = await this.db
      .select()
      .from(companyInvitation)
      .where(and(eq(companyInvitation.email, email), eq(companyInvitation.companyId, companyId), eq(companyInvitation.status, 'pending')))
      .limit(1);
    if (!result) return null;
    return this.mapper.toDomain(result as ICompanyInvitationDataAccess);
  }
} 