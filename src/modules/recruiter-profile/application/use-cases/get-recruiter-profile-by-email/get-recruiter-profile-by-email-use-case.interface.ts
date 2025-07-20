import { type RecruiterProfile } from '~modules/recruiter-profile/domain/entities/recruiter-profile.entity';

import { type IUseCase } from '~shared/application/use-cases/use-case.interface';

export interface IGetRecruiterProfileByEmailUseCase extends IUseCase<{ email: string }, RecruiterProfile | null> {}
