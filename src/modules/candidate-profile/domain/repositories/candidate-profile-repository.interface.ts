import { type CandidateProfile } from '~modules/candidate-profile/domain/entities/candidate-profile.entity';

import { type IBaseRepository } from '~shared/domain/repositories/base-repository.interface';

export interface ICandidateProfileRepository extends IBaseRepository<CandidateProfile, string> {
  findByUserDetailsId(userDetailsId: string): Promise<CandidateProfile | null>;
}
