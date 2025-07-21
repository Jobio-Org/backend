import { Builder } from 'builder-pattern';

export class RecruiterProfile {
  public readonly id: string;
  public readonly userDetailsId: string;
  public readonly telegram?: string | null;
  public readonly phone?: string | null;
  public readonly linkedin?: string | null;
  public readonly website?: string | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly activeCompanyId?: string | null;

  public static builder(userDetailsId: string) {
    return Builder(RecruiterProfile, {
      userDetailsId,
    });
  }
}
