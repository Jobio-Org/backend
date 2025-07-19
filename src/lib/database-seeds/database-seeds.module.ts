import { Global, Module } from '@nestjs/common';

import { DatabaseSeedsDiToken } from '~lib/database-seeds/constants';
import { SeedRegistryService } from '~lib/database-seeds/services/seed-registry/seed-registry.service';
import { RunAllSeedsUseCase } from '~lib/database-seeds/use-cases/run-all-seeds/run-all-seeds.use-case';

@Global()
@Module({
  providers: [
    { provide: DatabaseSeedsDiToken.SEED_REGISTRY, useClass: SeedRegistryService },
    { provide: DatabaseSeedsDiToken.RUN_ALL_SEEDS_USE_CASE, useClass: RunAllSeedsUseCase },
  ],
  exports: [DatabaseSeedsDiToken.SEED_REGISTRY, DatabaseSeedsDiToken.RUN_ALL_SEEDS_USE_CASE],
})
export class DatabaseSeedsModule {}
