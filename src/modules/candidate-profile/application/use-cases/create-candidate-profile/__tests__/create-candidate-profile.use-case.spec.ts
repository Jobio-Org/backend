import { type ICandidateProfileRepository } from '~modules/candidate-profile/domain/repositories/candidate-profile-repository.interface';

import { CreateCandidateProfileUseCase } from '../create-candidate-profile.use-case';

describe('CreateCandidateProfileUseCase', () => {
  let useCase: CreateCandidateProfileUseCase;
  let repository: jest.Mocked<ICandidateProfileRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
    } as any;
    useCase = new CreateCandidateProfileUseCase(repository);
    useCase['_dbContext'] = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
    } as any;
    useCase['_eventDispatcher'] = {
      dispatchEvents: jest.fn(),
    } as any;
  });

  it('should create candidate profile', async () => {
    await useCase.execute({ userDetailsId: 'ud1' });
    expect(repository.create).toHaveBeenCalled();
    const created = repository.create.mock.calls[0][0];
    expect(created.userDetailsId).toBe('ud1');
  });
});
