import { type RecruiterProfile } from '~modules/recruiter-profile/domain/entities/recruiter-profile.entity';

export interface IRecruiterProfileQueryService {
  getRecruiterProfileByUserId(userId: string): Promise<RecruiterProfile | null>;
  getRecruiterProfileByEmail(email: string): Promise<RecruiterProfile | null>;
  getRecruiterProfileByUserDetailsId(userDetailsId: string): Promise<RecruiterProfile | null>;
}
