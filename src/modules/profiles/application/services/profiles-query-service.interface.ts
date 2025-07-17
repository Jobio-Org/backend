import { RecruiterProfile } from '~modules/profiles/domain/entities/recruiter-profile.entity';

export interface IProfilesQueryService {
  getRecruiterProfileByUserId(userId: string): Promise<RecruiterProfile | null>;
  getRecruiterProfileByEmail(email: string): Promise<RecruiterProfile | null>;
}
