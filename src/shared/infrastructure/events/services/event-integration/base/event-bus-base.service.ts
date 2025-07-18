import { type IEventIntegrationService } from '~shared/application/services/event-integration-service.interface';

import { type IEvent, type IEventBus, type IEventPublisher, type IMessageSource } from 'src/lib/nest-event-driven';

export abstract class EventBusBaseService implements IEventIntegrationService {
  constructor(
    private readonly eventBus: IEventBus,
    private readonly publisher: IEventPublisher,
    subscriber: IMessageSource,
  ) {
    subscriber.bridgeEventsTo(this.eventBus.subject$);
  }

  publishEvent(event: IEvent): void {
    this.publisher.publish(event);
  }

  publishEvents(event: IEvent[]): void {
    this.publisher.publishAll(event);
  }
}
