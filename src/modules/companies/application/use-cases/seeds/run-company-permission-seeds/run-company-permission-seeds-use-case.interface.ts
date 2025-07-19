import { type IBaseSeedInput } from '~lib/database-seeds/base/base-seed-use-case.interface';
import { type SeedResult } from '~lib/database-seeds/use-cases/run-all-seeds/run-all-seeds-use-case.interface';

export interface IRunCompanyPermissionSeedsUseCase {
  execute(input?: IBaseSeedInput): Promise<SeedResult>;
}
