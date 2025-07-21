import { InvalidUserRoleException } from '~modules/user-context/application/exceptions/invalid-user-role.exception';
import { UserDetailsNotFoundException } from '~modules/user-context/application/exceptions/user-details-not-found.exception';

import { UserRole } from '~shared/domain/enums/user-role.enum';

import { UserContextService } from '../user-context.service';

describe('UserContextService', () => {
  let service: UserContextService;
  let getUserDetailsByIdUseCase: any;
  let candidateProfileQueryService: any;
  let recruiterProfileQueryService: any;

  beforeEach(() => {
    getUserDetailsByIdUseCase = { execute: jest.fn() };
    candidateProfileQueryService = { getCandidateProfileByUserDetailsId: jest.fn() };
    recruiterProfileQueryService = { getRecruiterProfileByUserDetailsId: jest.fn() };
    service = new UserContextService(
      getUserDetailsByIdUseCase,
      candidateProfileQueryService,
      recruiterProfileQueryService,
    );
  });

  it('should return context for candidate', async () => {
    getUserDetailsByIdUseCase.execute.mockResolvedValue({
      id: 'ud1',
      userId: 'u1',
      fullName: 'Test',
      role: UserRole.CANDIDATE,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
    });
    candidateProfileQueryService.getCandidateProfileByUserDetailsId.mockResolvedValue({ id: 'cp1' });
    const result = await service.getUserContext('u1');
    expect(result.id).toBe('ud1');
    expect(result.profile).toEqual({ id: 'cp1' });
    expect(result.role).toBe(UserRole.CANDIDATE);
  });

  it('should return context for recruiter', async () => {
    getUserDetailsByIdUseCase.execute.mockResolvedValue({
      id: 'ud2',
      userId: 'u2',
      fullName: 'Recruiter',
      role: UserRole.RECRUITER,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
    });
    recruiterProfileQueryService.getRecruiterProfileByUserDetailsId.mockResolvedValue({ id: 'rp1' });
    const result = await service.getUserContext('u2');
    expect(result.id).toBe('ud2');
    expect(result.profile).toEqual({ id: 'rp1' });
    expect(result.role).toBe(UserRole.RECRUITER);
  });

  it('should throw if userDetails not found', async () => {
    getUserDetailsByIdUseCase.execute.mockResolvedValue(null);
    try {
      await service.getUserContext('u3');
      fail('Should throw');
    } catch (e) {
      expect(e).toBeInstanceOf(UserDetailsNotFoundException);
    }
  });

  it('should throw if role is invalid', async () => {
    getUserDetailsByIdUseCase.execute.mockResolvedValue({
      id: 'ud4',
      userId: 'u4',
      fullName: 'Invalid',
      role: 'admin',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
    });
    try {
      await service.getUserContext('u4');
      fail('Should throw');
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidUserRoleException);
    }
  });
});
