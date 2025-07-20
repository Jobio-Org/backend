import { Inject, Injectable } from '@nestjs/common';

import { GetRecruiterProfileByUserIdDto } from '~modules/recruiter-profile/application/dto/get-recruiter-profile-by-user-id.dto';
import { IGetRecruiterProfileUseCase } from '~modules/recruiter-profile/application/use-cases/get-recruiter-profile/get-recruiter-profile-use-case.interface';
import { RecruiterProfileDiToken } from '~modules/recruiter-profile/constants';
import { RecruiterProfile } from '~modules/recruiter-profile/domain/entities/recruiter-profile.entity';
import { IRecruiterProfileRepository } from '~modules/recruiter-profile/domain/repositories/recruiter-profile-repository.interface';
import { UserDetailsDiToken } from '~modules/user-details/constants';
import { IUserDetailsRepository } from '~modules/user-details/domain/repositories/user-details-repository.interface';

import { UserRole } from '~shared/domain/enums/user-role.enum';

@Injectable()
export class GetRecruiterProfileUseCase implements IGetRecruiterProfileUseCase {
  constructor(
    @Inject(UserDetailsDiToken.USER_DETAILS_REPOSITORY)
    private readonly userDetailsRepository: IUserDetailsRepository,
    @Inject(RecruiterProfileDiToken.RECRUITER_PROFILE_REPOSITORY)
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
