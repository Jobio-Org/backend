import { RecruiterProfile } from '~modules/profiles/domain/entities/recruiter-profile.entity';

import { Query } from '~shared/application/CQS/query.abstract';

export interface IGetRecruiterProfileByEmailUseCase extends Query<{ email: string }, RecruiterProfile | null> {}
