import { Inject, Injectable, Logger } from '@nestjs/common';

import { type IBaseSeedInput } from '~lib/database-seeds/base/base-seed-use-case.interface';
import { DatabaseSeedsDiToken } from '~lib/database-seeds/constants';
import { type ISeedRegistry } from '~lib/database-seeds/services/seed-registry/seed-registry.service';
import {
  type IRunAllSeedsUseCase,
  type RunAllSeedsOutput,
} from '~lib/database-seeds/use-cases/run-all-seeds/run-all-seeds-use-case.interface';

@Injectable()
export class RunAllSeedsUseCase implements IRunAllSeedsUseCase {
  private readonly logger = new Logger(RunAllSeedsUseCase.name);

  constructor(
    @Inject(DatabaseSeedsDiToken.SEED_REGISTRY)
    private readonly seedRegistry: ISeedRegistry,
  ) {}

  async execute(input: IBaseSeedInput = {}): Promise<RunAllSeedsOutput> {
    const { clearExisting = true, dryRun = false } = input;

    this.logger.log('Starting execution of all seeds...');
    this.logger.log(`Clear existing: ${clearExisting}, Dry run: ${dryRun}`);

    const seeds = this.seedRegistry.getSeeds();
    const results: RunAllSeedsOutput['results'] = {};

    for (const [name, useCase] of seeds.entries()) {
      try {
        this.logger.log(`Running ${name}...`);

        const result = await useCase.execute({ clearExisting, dryRun });

        results[name] = {
          success: result.success,
          count: result.count,
          error: result.error,
        };

        this.logger.log(`${name} completed with success: ${result.success}, count: ${result.count}`);
      } catch (error) {
        this.logger.error(`Failed to run ${name}: ${error.message}`, error.stack);

        results[name] = {
          success: false,
          count: 0,
          error: error.message,
        };
      }
    }

    const success = Object.values(results).every((result) => result.success);
    this.logger.log(`All seeds execution completed. Overall success: ${success}`);

    return {
      success,
      results,
    };
  }
}
