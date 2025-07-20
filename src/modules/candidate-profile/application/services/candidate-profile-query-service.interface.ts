import { type CandidateProfile } from '~modules/candidate-profile/domain/entities/candidate-profile.entity';

export interface ICandidateProfileQueryService {
  getCandidateProfileByUserId(userId: string): Promise<CandidateProfile | null>;
  getCandidateProfileWithUserDetails(userDetailsId: string): Promise<CandidateProfile | null>;
}
