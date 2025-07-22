import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { IAppConfigService } from '~shared/application/services/app-config-service.interface';
import { BaseToken } from '~shared/constants';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [BaseToken.APP_CONFIG],
      useFactory: (config: IAppConfigService) => ({
        throttlers: [
          {
            ttl: config.get('THROTTLE_TTL'),
            limit: config.get('THROTTLE_LIMIT'),
          },
        ],
        storage: new ThrottlerStorageRedisService(config.get('REDIS_URL')),
      }),
    }),
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
  exports: [ThrottlerModule],
})
export class GlobalThrottlerModule {}
