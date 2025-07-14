import { CandidateProfile } from '~modules/profiles/domain/entities/candidate-profile.entity';
import { RecruiterProfile } from '~modules/profiles/domain/entities/recruiter-profile.entity';

import { Query } from '~shared/application/CQS/query.abstract';

export interface IUserWithDetails {
  id: string;
  email?: string;
  phone?: string;
  emailConfirmedAt?: Date;
  phoneConfirmedAt?: Date;
  lastSignInAt?: Date;
  signUpCompleted: boolean;
  fullName?: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetUserProfileWithAuthUseCase
  extends Query<
    { userId: string; accessToken: string },
    {
      user: IUserWithDetails;
      profile: CandidateProfile | RecruiterProfile | null;
    }
  > {}
