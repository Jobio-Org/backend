import { Inject, Injectable } from '@nestjs/common';

import { GetRecruiterProfileByEmailDto } from '~modules/profiles/application/dto/get-recruiter-profile-by-email.dto';
import { GetRecruiterProfileByUserIdDto } from '~modules/profiles/application/dto/get-recruiter-profile-by-user-id.dto';
import { IProfilesQueryService } from '~modules/profiles/application/services/profiles-query-service.interface';
import { IGetRecruiterProfileByEmailUseCase } from '~modules/profiles/application/use-cases/get-recruiter-profile-by-email/get-recruiter-profile-by-email-use-case.interface';
import { IGetRecruiterProfileUseCase } from '~modules/profiles/application/use-cases/get-recruiter-profile/get-recruiter-profile-use-case.interface';
import { ProfilesDiToken } from '~modules/profiles/constants';
import { RecruiterProfile } from '~modules/profiles/domain/entities/recruiter-profile.entity';

@Injectable()
export class ProfilesQueryService implements IProfilesQueryService {
  constructor(
    @Inject(ProfilesDiToken.GET_RECRUITER_PROFILE_BY_ID_USE_CASE)
    private readonly getRecruiterProfileIdUseCase: IGetRecruiterProfileUseCase,
    @Inject(ProfilesDiToken.GET_RECRUITER_PROFILE_BY_EMAIL_USE_CASE)
    private readonly getRecruiterProfileByEmailUseCase: IGetRecruiterProfileByEmailUseCase,
  ) {}

  async getRecruiterProfileByUserId(userId: string): Promise<RecruiterProfile | null> {
    const dto = new GetRecruiterProfileByUserIdDto(userId);

    return this.getRecruiterProfileIdUseCase.execute(dto);
  }

  async getRecruiterProfileByEmail(email: string): Promise<RecruiterProfile | null> {
    const dto = new GetRecruiterProfileByEmailDto(email);

    return this.getRecruiterProfileByEmailUseCase.execute(dto);
  }
}
