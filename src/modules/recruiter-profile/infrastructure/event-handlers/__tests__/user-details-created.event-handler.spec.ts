import { UserRole } from '../../../../../shared/domain/enums/user-role.enum';
import { User } from '../../../../auth/domain/entities/user.entity';
import { UserDetails } from '../../../../user-details/domain/entities/user-details.entity';
import { UserDetailsCreatedEvent } from '../../../../user-details/domain/events/user-details-created.event';
import { type ICreateRecruiterProfileUseCase } from '../../../application/use-cases/create-recruiter-profile/create-recruiter-profile-use-case.interface';
import { UserDetailsCreatedEventHandler } from '../user-details-created.event-handler';

describe('UserDetailsCreatedEventHandler', () => {
  let handler: UserDetailsCreatedEventHandler;
  let useCase: ICreateRecruiterProfileUseCase;
  let userDetails: UserDetails;
  let user: User;

  beforeEach(() => {
    useCase = { execute: jest.fn() } as ICreateRecruiterProfileUseCase;
    handler = new UserDetailsCreatedEventHandler(useCase);
    user = User.builder('user-1').build();
    userDetails = UserDetails.builder('user-1', UserRole.RECRUITER).id('details-1').build();
  });

  it('should not call useCase if role is not RECRUITER', async () => {
    const event = new UserDetailsCreatedEvent({ role: UserRole.CANDIDATE, userDetails, user });
    await handler.handle(event);
    expect(useCase.execute).not.toHaveBeenCalled();
  });

  it('should call useCase.execute if role is RECRUITER', async () => {
    const event = new UserDetailsCreatedEvent({ role: UserRole.RECRUITER, userDetails, user });
    await handler.handle(event);
    expect(useCase.execute).toHaveBeenCalledWith({ userDetailsId: userDetails.id });
  });
});
