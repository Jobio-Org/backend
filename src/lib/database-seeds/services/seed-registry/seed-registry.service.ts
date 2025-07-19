import { Injectable } from '@nestjs/common';

import { type IBaseSeedUseCase } from '~lib/database-seeds/base/base-seed-use-case.interface';

export interface ISeedRegistry {
  registerSeed(name: string, useCase: IBaseSeedUseCase): void;
  getSeeds(): Map<string, IBaseSeedUseCase>;
}

@Injectable()
export class SeedRegistryService implements ISeedRegistry {
  private readonly seeds = new Map<string, IBaseSeedUseCase>();

  registerSeed(name: string, useCase: IBaseSeedUseCase): void {
    this.seeds.set(name, useCase);
  }

  getSeeds(): Map<string, IBaseSeedUseCase> {
    return this.seeds;
  }
}
