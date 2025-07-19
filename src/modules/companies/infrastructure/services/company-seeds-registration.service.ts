import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { DatabaseSeedsDiToken } from '~lib/database-seeds/constants';
import { ISeedRegistry } from '~lib/database-seeds/services/seed-registry';

import { RunCompanySeedsUseCase } from '~modules/companies/application/use-cases/seeds/run-company-seeds/run-company-seeds.use-case';
import { CompaniesDiToken } from '~modules/companies/constants';

@Injectable()
export class CompanySeedsRegistrationService implements OnModuleInit {
  constructor(
    @Inject(DatabaseSeedsDiToken.SEED_REGISTRY)
    private readonly seedRegistry: ISeedRegistry,
    @Inject(CompaniesDiToken.RUN_COMPANY_SEEDS_USE_CASE)
    private readonly runCompanySeedsUseCase: RunCompanySeedsUseCase,
  ) {}

  onModuleInit() {
    // Register company seeds
    this.seedRegistry.registerSeed('companySeeds', this.runCompanySeedsUseCase);
  }
}
