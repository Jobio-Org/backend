import { CandidateProfile } from '~modules/candidate-profile/domain/entities/candidate-profile.entity';
import { type ICandidateProfileRepository } from '~modules/candidate-profile/domain/repositories/candidate-profile-repository.interface';
import { type IUserDetailsRepository } from '~modules/user-details/domain/repositories/user-details-repository.interface';

import { UpdateCandidateProfileUseCase } from '../update-candidate-profile.use-case';

describe('UpdateCandidateProfileUseCase', () => {
  let useCase: UpdateCandidateProfileUseCase;
  let userDetailsRepository: jest.Mocked<IUserDetailsRepository>;
  let candidateProfileRepository: jest.Mocked<ICandidateProfileRepository>;

  beforeEach(() => {
    userDetailsRepository = {
      findByUserId: jest.fn(),
    } as any;
    candidateProfileRepository = {
      findByUserDetailsId: jest.fn(),
      save: jest.fn(),
    } as any;
    useCase = new UpdateCandidateProfileUseCase(userDetailsRepository, candidateProfileRepository);
    useCase['_dbContext'] = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
    } as any;
    useCase['_eventDispatcher'] = {
      dispatchEvents: jest.fn(),
    } as any;
  });

  it('should update candidate profile', async () => {
    userDetailsRepository.findByUserId.mockResolvedValue({ id: 'ud1', role: 'candidate' } as any);
    const candidateProfile = CandidateProfile.builder('ud1').id('cp1').build();
    candidateProfileRepository.findByUserDetailsId.mockResolvedValue(candidateProfile);
    candidateProfileRepository.save.mockResolvedValue(undefined);
    await useCase.execute({ userId: 'u1', position: 'dev' } as any);
    expect(candidateProfileRepository.save).toHaveBeenCalled();
  });

  it('should throw if user details not found', async () => {
    userDetailsRepository.findByUserId.mockResolvedValue(null);
    await expect(useCase.execute({ userId: 'u1' } as any)).rejects.toThrow('User details not found');
  });

  it('should throw if user is not candidate', async () => {
    userDetailsRepository.findByUserId.mockResolvedValue({ id: 'ud1', role: 'recruiter' } as any);
    await expect(useCase.execute({ userId: 'u1' } as any)).rejects.toThrow('User is not a candidate');
  });

  it('should throw if candidate profile not found', async () => {
    userDetailsRepository.findByUserId.mockResolvedValue({ id: 'ud1', role: 'candidate' } as any);
    candidateProfileRepository.findByUserDetailsId.mockResolvedValue(null);
    await expect(useCase.execute({ userId: 'u1' } as any)).rejects.toThrow('Candidate profile not found');
  });
});
