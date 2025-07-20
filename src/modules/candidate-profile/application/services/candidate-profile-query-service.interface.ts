import { type CandidateProfile } from '~modules/candidate-profile/domain/entities/candidate-profile.entity';

export interface ICandidateProfileQueryService {
  getCandidateProfileByUserDetailsId(userId: string): Promise<CandidateProfile | null>;
}
