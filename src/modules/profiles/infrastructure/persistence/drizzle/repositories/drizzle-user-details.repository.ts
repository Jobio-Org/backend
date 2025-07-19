import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { POSTGRES_DB } from '~lib/drizzle-postgres';

import { SupabaseClientService } from '~modules/auth/infrastructure/supabase/services/supabase-client/supabase-client.service';
import { UserDetails } from '~modules/profiles/domain/entities/user-details.entity';
import {
  IUserDetailsDataAccess,
  UserDetailsMapper,
} from '~modules/profiles/domain/mappers/user-details/user-details.mapper';
import { IUserDetailsRepository } from '~modules/profiles/domain/repositories/user-details-repository.interface';

import { UserRole } from '~shared/domain/enums/user-role.enum';
import { IDataAccessMapper } from '~shared/domain/mappers';
import {
  DrizzleRepository,
  TableDefinition,
} from '~shared/infrastructure/database/drizzle/repository/drizzle.repository';
import { MergedDbSchema } from '~shared/infrastructure/database/drizzle/schema';
import { userDetails } from '~shared/infrastructure/database/drizzle/schema/public-database-schema';

@Injectable()
export class DrizzleUserDetailsRepository
  extends DrizzleRepository<UserDetails, TableDefinition<typeof userDetails>, IUserDetailsDataAccess>
  implements IUserDetailsRepository
{
  constructor(
    @Inject(POSTGRES_DB) db: NodePgDatabase<MergedDbSchema>,
    @Inject(UserDetailsMapper) mapper: IDataAccessMapper<UserDetails, IUserDetailsDataAccess>,
    private readonly supabaseClientService: SupabaseClientService,
  ) {
    super(TableDefinition.create(userDetails, 'id'), db, mapper);
  }

  async findByUserId(userId: string): Promise<UserDetails | null> {
    const [result] = await this.db.select().from(userDetails).where(eq(userDetails.userId, userId)).limit(1);

    if (!result) return null;
    return this.mapper.toDomain(result as IUserDetailsDataAccess);
  }

  async findByEmail(email: string): Promise<UserDetails | null> {
    const { data, error } = await this.supabaseClientService.client.rpc('get_auth_user_by_email', {
      email,
    });

    if (error) throw new Error('Failed to get recruiter profile by email');

    if (Array.isArray(data) || !data.length) return null;

    const userDetails = await this.findByUserId(data[0].id);

    if (!userDetails) return null;

    return userDetails;
  }

  async findByRole(role: UserRole): Promise<UserDetails[]> {
    const results = await this.db.select().from(userDetails).where(eq(userDetails.role, role));

    return results.map((result) => this.mapper.toDomain(result as IUserDetailsDataAccess));
  }
}
