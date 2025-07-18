import { type RecruiterProfile } from '~modules/profiles/domain/entities/recruiter-profile.entity';

import { type Query } from '~shared/application/CQS/query.abstract';

export interface IGetRecruiterProfileByEmailUseCase extends Query<{ email: string }, RecruiterProfile | null> {}
