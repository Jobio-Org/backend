import { NestFactory } from '@nestjs/core';
import { Command } from 'commander';

import { SeedsDiToken } from '~shared/infrastructure/seeds/constants';
import { type IBaseSeedInput } from '~shared/infrastructure/seeds/use-cases/base-seed/base-seed-use-case.interface';
import { type RunAllSeedsUseCase } from '~shared/infrastructure/seeds/use-cases/run-all-seeds/run-all-seeds.use-case';

import { AppModule } from 'src/app.module';

export class RunSeedsCommand {
  private static program = new Command();

  static async run() {
    this.program.name('seeds').description('Database seeding commands').version('1.0.0');

    this.program
      .command('run-all')
      .description('Run all database seeds')
      .option('--dry-run', 'Simulate the operation without actually executing it', false)
      .option('--no-clear-existing', 'Skip clearing existing data before seeding', false)
      .action(async (options) => {
        await this.executeAllSeeds(options);
      });

    await this.program.parseAsync(process.argv);
  }

  private static async executeAllSeeds(options: IBaseSeedInput = {}) {
    const { dryRun = true, clearExisting = false } = options;

    console.log('🌱 Starting all seeds...');
    if (dryRun) {
      console.log('🔍 DRY RUN MODE - No actual changes will be made');
    }
    if (!clearExisting) {
      console.log('⚠️  SKIPPING CLEAR - Existing data will be preserved');
    }

    try {
      const app = await NestFactory.createApplicationContext(AppModule);
      const runAllSeedsUseCase = app.get<RunAllSeedsUseCase>(SeedsDiToken.RUN_ALL_SEEDS_USE_CASE);

      const result = await runAllSeedsUseCase.execute({ dryRun, clearExisting });

      if (result.success) {
        console.log('✅ All seeds completed successfully!');
        console.log('📊 Results:');
        Object.entries(result.results).forEach(([key, value]) => {
          console.log(
            `  ${key}: ${value.success ? '✅' : '❌'} ${value.count} items ${value.error ? `(${value.error})` : ''}`,
          );
        });
      } else {
        console.log('❌ Some seeds failed!');
        console.log('📊 Results:');
        Object.entries(result.results).forEach(([key, value]) => {
          console.log(
            `  ${key}: ${value.success ? '✅' : '❌'} ${value.count} items ${value.error ? `(${value.error})` : ''}`,
          );
        });
      }

      await app.close();
    } catch (error) {
      console.error('❌ Failed to run seeds:', error.message);
      console.error('Stack trace:', error.stack);
      process.exit(1);
    }
  }
}
