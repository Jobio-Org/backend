import { Builder } from 'builder-pattern';

import { UserRole } from '~shared/domain/enums/user-role.enum';

export class UserDetails {
  public readonly id: string;
  public readonly userId: string;
  public readonly fullName?: string | null;
  public readonly role: UserRole;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public get isCandidate(): boolean {
    return this.role === UserRole.CANDIDATE;
  }

  public get isRecruiter(): boolean {
    return this.role === UserRole.RECRUITER;
  }
  public static builder(userId: string, role: UserRole) {
    return Builder(UserDetails, {
      userId,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
