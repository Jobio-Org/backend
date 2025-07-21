import { type ICompaniesQueryService } from '../../../../companies/application/services/companies/companies-query-service.interface';
import { type IGetRecruiterProfileByEmailUseCase } from '../../../application/use-cases/get-recruiter-profile-by-email/get-recruiter-profile-by-email-use-case.interface';
import { type IGetRecruiterProfileUseCase } from '../../../application/use-cases/get-recruiter-profile/get-recruiter-profile-use-case.interface';
import { type IRecruiterProfileRepository } from '../../../domain/repositories/recruiter-profile-repository.interface';
import { RecruiterProfileQueryService } from '../recruiter-profile-query.service';

describe('RecruiterProfileQueryService', () => {
  let service: RecruiterProfileQueryService;
  let getRecruiterProfileIdUseCase: IGetRecruiterProfileUseCase;
  let getRecruiterProfileByEmailUseCase: IGetRecruiterProfileByEmailUseCase;
  let recruiterProfileRepository: IRecruiterProfileRepository;
  let companiesQueryService: ICompaniesQueryService;

  beforeEach(() => {
    getRecruiterProfileIdUseCase = { execute: jest.fn() } as unknown as IGetRecruiterProfileUseCase;
    getRecruiterProfileByEmailUseCase = { execute: jest.fn() } as unknown as IGetRecruiterProfileByEmailUseCase;
    recruiterProfileRepository = { findByUserDetailsId: jest.fn() } as unknown as IRecruiterProfileRepository;
    companiesQueryService = { getActiveCompanyIdByRecruiterProfileId: jest.fn() } as unknown as ICompaniesQueryService;
    service = new RecruiterProfileQueryService(
      getRecruiterProfileIdUseCase,
      getRecruiterProfileByEmailUseCase,
      recruiterProfileRepository,
      companiesQueryService,
    );
  });

  it('should return null if recruiter profile not found by userDetailsId', async () => {
    (recruiterProfileRepository.findByUserDetailsId as jest.Mock).mockResolvedValue(null);
    const result = await service.getRecruiterProfileByUserDetailsId('id');
    expect(result).toBeNull();
  });

  it('should call getRecruiterProfileIdUseCase.execute for getRecruiterProfileByUserId', async () => {
    (getRecruiterProfileIdUseCase.execute as jest.Mock).mockResolvedValue('profile');
    const result = await service.getRecruiterProfileByUserId('user-1');
    expect(getRecruiterProfileIdUseCase.execute).toHaveBeenCalled();
    expect(result).toBe('profile');
  });

  it('should call getRecruiterProfileByEmailUseCase.execute for getRecruiterProfileByEmail', async () => {
    (getRecruiterProfileByEmailUseCase.execute as jest.Mock).mockResolvedValue('profile');
    const result = await service.getRecruiterProfileByEmail('mail@mail.com');
    expect(getRecruiterProfileByEmailUseCase.execute).toHaveBeenCalled();
    expect(result).toBe('profile');
  });
});
