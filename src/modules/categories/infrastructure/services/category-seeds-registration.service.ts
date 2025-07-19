import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { DatabaseSeedsDiToken } from '~lib/database-seeds/constants';
import { ISeedRegistry } from '~lib/database-seeds/services/seed-registry/seed-registry.service';

import { RunCategorySeedsUseCase } from '~modules/categories/application/use-cases/seeds/run-category-seeds/run-category-seeds.use-case';
import { RunSubcategorySeedsUseCase } from '~modules/categories/application/use-cases/seeds/run-subcategory-seeds/run-subcategory-seeds.use-case';
import { CategoriesDiToken } from '~modules/categories/constants';

@Injectable()
export class CategorySeedsRegistrationService implements OnModuleInit {
  constructor(
    @Inject(DatabaseSeedsDiToken.SEED_REGISTRY)
    private readonly seedRegistry: ISeedRegistry,
    @Inject(CategoriesDiToken.RUN_CATEGORY_SEEDS_USE_CASE)
    private readonly runCategorySeedsUseCase: RunCategorySeedsUseCase,
    @Inject(CategoriesDiToken.RUN_SUBCATEGORY_SEEDS_USE_CASE)
    private readonly runSubcategorySeedsUseCase: RunSubcategorySeedsUseCase,
  ) {}

  onModuleInit() {
    // Register category seeds
    this.seedRegistry.registerSeed('categorySeeds', this.runCategorySeedsUseCase);
    this.seedRegistry.registerSeed('subcategorySeeds', this.runSubcategorySeedsUseCase);
  }
}
