import { Injectable, Inject } from '@nestjs/common';

import { ProfilesDiToken } from '~modules/profiles/constants';
import { IUserDetailsRepository } from '~modules/profiles/domain/repositories/user-details-repository.interface';
import { IRecruiterProfileRepository } from '~modules/profiles/domain/repositories/recruiter-profile-repository.interface';
import { IGetRecruiterProfileIdUseCase } from './get-recruiter-profile-id-use-case.interface';
import { GetRecruiterProfileIdDto } from '../../dto/get-recruiter-profile-id.dto';

import { UserRole } from '~shared/domain/enums/user-role.enum';

@Injectable()
export class GetRecruiterProfileIdUseCase implements IGetRecruiterProfileIdUseCase {
  constructor(
    @Inject(ProfilesDiToken.USER_DETAILS_REPOSITORY)
    private readonly userDetailsRepository: IUserDetailsRepository,
    @Inject(ProfilesDiToken.RECRUITER_PROFILE_REPOSITORY)
    private readonly recruiterProfileRepository: IRecruiterProfileRepository,
  ) {}

  async execute(dto: GetRecruiterProfileIdDto): Promise<string | null> {
    const userDetails = await this.userDetailsRepository.findByUserId(dto.userId);
    
    if (!userDetails || userDetails.role !== UserRole.RECRUITER) {
      return null;
    }

    const recruiterProfile = await this.recruiterProfileRepository.findByUserDetailsId(userDetails.id);
    
    if (!recruiterProfile) {
      return null;
    }

    return recruiterProfile.id;
  }
} 