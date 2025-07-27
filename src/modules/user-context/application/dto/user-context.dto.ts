import { Builder } from 'builder-pattern';

import { type CandidateProfile } from '~modules/candidate-profile/domain/entities/candidate-profile.entity';
import { type RecruiterProfile } from '~modules/recruiter-profile/domain/entities/recruiter-profile.entity';

import { type UserRole } from '~shared/domain/enums/user-role.enum';

export class UserContextDto {
  public readonly id: string;
  public readonly userId: string;
  public readonly email: string;
  public readonly fullName?: string | null;
  public readonly role: UserRole;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly isCandidate: boolean;
  public readonly isRecruiter: boolean;
  public readonly profile: CandidateProfile | RecruiterProfile | null;

  public static builder() {
    return Builder(UserContextDto);
  }
}
