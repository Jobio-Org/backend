import { UserCreatedEvent } from '~modules/auth/domain/events/user-created.event';
import { type ICreateUserDetailsUseCase } from '~modules/user-details/application/use-cases/create-user-details/create-user-details-use-case.interface';
import { type IGetUserDetailsByIdUseCase } from '~modules/user-details/application/use-cases/get-user-details-by-id/get-user-details-by-id-use-case.interface';
import { UserDetails } from '~modules/user-details/domain/entities/user-details.entity';
import { UserDetailsCreatedEvent } from '~modules/user-details/domain/events/user-details-created.event';

import { type IEventDispatcher } from '~shared/application/events/event-dispatcher/event-dispatcher.interface';
import { UserRole } from '~shared/domain/enums/user-role.enum';

import { UserCreatedEventHandler } from '../user-created.event-handler';

describe('UserCreatedEventHandler', () => {
  let handler: UserCreatedEventHandler;
  let createUserDetailsUseCase: jest.Mocked<ICreateUserDetailsUseCase>;
  let getUserDetailsByIdUseCase: jest.Mocked<IGetUserDetailsByIdUseCase>;
  let eventDispatcher: jest.Mocked<IEventDispatcher>;

  beforeEach(() => {
    createUserDetailsUseCase = { execute: jest.fn() } as any;
    getUserDetailsByIdUseCase = { execute: jest.fn() } as any;
    eventDispatcher = {
      registerEvent: jest.fn(),
      dispatchEvents: jest.fn(),
    } as any;
    handler = new UserCreatedEventHandler(createUserDetailsUseCase, getUserDetailsByIdUseCase, eventDispatcher);
  });

  it('should create user details, register and dispatch event', async () => {
    const user = { id: 'user-1' } as any;
    const role = UserRole.RECRUITER;
    const userDetails = UserDetails.builder('user-1', role).id('details-1').build();
    createUserDetailsUseCase.execute.mockResolvedValue(undefined);
    getUserDetailsByIdUseCase.execute.mockResolvedValue(userDetails);
    const event = new UserCreatedEvent({ user, role });
    await handler.handle(event);
    expect(createUserDetailsUseCase.execute).toHaveBeenCalledWith({ userId: 'user-1', role });
    expect(getUserDetailsByIdUseCase.execute).toHaveBeenCalledWith({ userId: 'user-1' });
    expect(eventDispatcher.registerEvent).toHaveBeenCalledWith(expect.any(UserDetailsCreatedEvent));
    expect(eventDispatcher.dispatchEvents).toHaveBeenCalled();
  });

  it('should throw if userDetails not found', async () => {
    const user = { id: 'user-1' } as any;
    const role = UserRole.RECRUITER;
    createUserDetailsUseCase.execute.mockResolvedValue(undefined);
    getUserDetailsByIdUseCase.execute.mockResolvedValue(null);
    const event = new UserCreatedEvent({ user, role });
    await expect(handler.handle(event)).rejects.toThrow('Failed to create user details');
  });
});
