import { type IUserDetailsRepository } from '~modules/user-details/domain/repositories/user-details-repository.interface';

import { UserRole } from '~shared/domain/enums/user-role.enum';

import { CreateUserDetailsUseCase } from '../create-user-details.use-case';

describe('CreateUserDetailsUseCase', () => {
  let useCase: CreateUserDetailsUseCase;
  let repository: jest.Mocked<IUserDetailsRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
    } as any;
    useCase = new CreateUserDetailsUseCase(repository);
    // Моки для _dbContext та _eventDispatcher
    useCase['_dbContext'] = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
    } as any;
    useCase['_eventDispatcher'] = {
      dispatchEvents: jest.fn(),
    } as any;
  });

  it('should create user details', async () => {
    await useCase.execute({ userId: 'user-1', fullName: 'Test User', role: UserRole.RECRUITER });
    expect(repository.create).toHaveBeenCalled();
    const created = repository.create.mock.calls[0][0];
    expect(created.userId).toBe('user-1');
    expect(created.fullName).toBe('Test User');
    expect(created.role).toBe(UserRole.RECRUITER);
  });
});
