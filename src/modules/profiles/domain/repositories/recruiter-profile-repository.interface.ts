import { type RecruiterProfile } from '~modules/profiles/domain/entities/recruiter-profile.entity';

import { type IBaseRepository } from '~shared/domain/repositories/base-repository.interface';

export interface IRecruiterProfileRepository extends IBaseRepository<RecruiterProfile, string> {
  findByUserDetailsId(userDetailsId: string): Promise<RecruiterProfile | null>;
}
