import { Inject, Injectable } from '@nestjs/common';

import { GetRecruiterProfileByUserIdDto } from '~modules/profiles/application/dto/get-recruiter-profile-by-user-id.dto';
import { IGetRecruiterProfileUseCase } from '~modules/profiles/application/use-cases/get-recruiter-profile/get-recruiter-profile-use-case.interface';
import { ProfilesDiToken } from '~modules/profiles/constants';
import { RecruiterProfile } from '~modules/profiles/domain/entities/recruiter-profile.entity';
import { IRecruiterProfileRepository } from '~modules/profiles/domain/repositories/recruiter-profile-repository.interface';
import { IUserDetailsRepository } from '~modules/profiles/domain/repositories/user-details-repository.interface';

import { UserRole } from '~shared/domain/enums/user-role.enum';

@Injectable()
export class GetRecruiterProfileUseCase implements IGetRecruiterProfileUseCase {
  constructor(
    @Inject(ProfilesDiToken.USER_DETAILS_REPOSITORY)
    private readonly userDetailsRepository: IUserDetailsRepository,
    @Inject(ProfilesDiToken.RECRUITER_PROFILE_REPOSITORY)
    private readonly recruiterProfileRepository: IRecruiterProfileRepository,
  ) {}

  async execute(dto: GetRecruiterProfileByUserIdDto): Promise<RecruiterProfile | null> {
    const userDetails = await this.userDetailsRepository.findByUserId(dto.userId);

    if (!userDetails || userDetails.role !== UserRole.RECRUITER) {
      return null;
    }

    const recruiterProfile = await this.recruiterProfileRepository.findByUserDetailsId(userDetails.id);

    if (!recruiterProfile) {
      return null;
    }

    return recruiterProfile;
  }
}
