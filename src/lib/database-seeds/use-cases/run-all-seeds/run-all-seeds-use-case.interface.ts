import { type IBaseSeedInput } from '~lib/database-seeds/base/base-seed-use-case.interface';

import { type IUseCase } from '~shared/application/use-cases/use-case.interface';

export interface SeedResult {
  success: boolean;
  count: number;
  error?: string;
}

export interface RunAllSeedsOutput {
  success: boolean;
  results: Record<string, SeedResult>;
}

export interface IRunAllSeedsUseCase extends IUseCase<IBaseSeedInput, RunAllSeedsOutput> {}
