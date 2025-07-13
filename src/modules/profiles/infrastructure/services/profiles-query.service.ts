import { Inject, Injectable } from '@nestjs/common';

import { IProfilesQueryService } from '~modules/profiles/application/services/profiles-query-service.interface';
import { IGetRecruiterProfileIdUseCase } from '~modules/profiles/application/use-cases/get-recruiter-profile-id/get-recruiter-profile-id-use-case.interface';
import { GetRecruiterProfileIdDto } from '~modules/profiles/application/dto/get-recruiter-profile-id.dto';
import { ProfilesDiToken } from '~modules/profiles/constants';

@Injectable()
export class ProfilesQueryService implements IProfilesQueryService {
  constructor(
    @Inject(ProfilesDiToken.GET_RECRUITER_PROFILE_ID_USE_CASE)
    private readonly getRecruiterProfileIdUseCase: IGetRecruiterProfileIdUseCase,
  ) {}

  async getRecruiterProfileIdByUserId(userId: string): Promise<string | null> {
    const dto = new GetRecruiterProfileIdDto(userId);

    return this.getRecruiterProfileIdUseCase.execute(dto);
  }
}
