import { type RecruiterProfile } from '~modules/recruiter-profile/domain/entities/recruiter-profile.entity';

import { type IUseCase } from '~shared/application/use-cases/use-case.interface';

import { type GetRecruiterProfileByUserIdDto } from '../../dto/get-recruiter-profile-by-user-id.dto';

export interface IGetRecruiterProfileUseCase
  extends IUseCase<GetRecruiterProfileByUserIdDto, RecruiterProfile | null> {}
