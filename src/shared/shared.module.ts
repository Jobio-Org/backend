import { Global, Module, Scope } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { DatabaseSeedsModule } from '~lib/database-seeds/database-seeds.module';
import { EventDrivenModule } from '~lib/nest-event-driven/event-driven.module';

import { EventDispatcher } from '~shared/application/events/event-dispatcher/implementation/event-dispatcher.interface';
import { AppConfigModel } from '~shared/application/models/app-config.model';
import { type IEventIntegrationService } from '~shared/application/services/event-integration-service.interface';
import { BaseToken } from '~shared/constants';
import { DatabaseModule } from '~shared/infrastructure/database/database.module';
import { EventEmitterEventSource } from '~shared/infrastructure/events/event-sources/event-emitter/event-emitter.event-source';
import { EventEmitterEventPublisher } from '~shared/infrastructure/events/publishers/event-emitter/event-emitter.event-publisher';
import { InMemoryEventIntegrationService } from '~shared/infrastructure/events/services/event-integration/in-memory/in-memory-event-integration.service';
import { PaginationService } from '~shared/infrastructure/services/pagination/pagination.service';
import { GlobalThrottlerModule } from '~shared/infrastructure/throttler/throttler.module';
import { validateConfig } from '~shared/infrastructure/util/validate-config';

@Global()
@Module({
  imports: [
    GlobalThrottlerModule,
    EventDrivenModule,
    EventEmitterModule.forRoot({ wildcard: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => validateConfig(config, AppConfigModel),
      ignoreEnvFile: false,
      envFilePath: ['./config/.env', './config/.env.local'],
    }),
    DatabaseModule,
    DatabaseSeedsModule,
  ],
  providers: [
    { provide: BaseToken.APP_CONFIG, useClass: ConfigService },
    InMemoryEventIntegrationService,
    EventEmitterEventPublisher,
    EventEmitterEventSource,
    { provide: BaseToken.PAGINATION_SERVICE, useClass: PaginationService },
    {
      provide: BaseToken.EVENT_DISPATCHER,
      useFactory: (integrationService: IEventIntegrationService) => new EventDispatcher(integrationService),
      inject: [InMemoryEventIntegrationService],
      scope: Scope.REQUEST,
    },
  ],
  exports: [BaseToken.APP_CONFIG, BaseToken.EVENT_DISPATCHER, BaseToken.PAGINATION_SERVICE],
})
export class SharedModule {}
