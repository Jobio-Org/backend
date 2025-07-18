import { eq } from 'drizzle-orm';
import { type NodePgDatabase } from 'drizzle-orm/node-postgres';

import { type IUserRepository } from '~modules/auth/application/repositories/user-repository.interface';

import { type MergedDbSchema } from '~shared/infrastructure/database/drizzle/schema';
import { authUsers } from '~shared/infrastructure/database/drizzle/schema/auth-database-schema';

export class DrizzleUserRepository implements IUserRepository {
  constructor(protected readonly db: NodePgDatabase<MergedDbSchema>) {}

  public async findHashedPassword(id: string): Promise<string | null> {
    const result = await this.db.query.authUsers.findFirst({
      where: eq(authUsers.id, id),
      columns: {
        encryptedPassword: true,
      },
    });

    if (!result) return null;

    const { encryptedPassword = null } = result;

    return encryptedPassword;
  }
}
