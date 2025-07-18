import { Builder, type IBuilder } from 'builder-pattern';

export class CompanyInvitation {
  public readonly id: string;
  public readonly companyId: string;
  public readonly invitedByRecruiterProfileId: string;
  public readonly companyRoleId: string;
  public readonly email: string;
  public readonly firstName?: string;
  public readonly lastName?: string;
  public readonly message?: string;
  public readonly token: string;
  public readonly status: string;
  public readonly expiresAt: Date;
  public readonly acceptedAt?: Date;
  public readonly acceptedByRecruiterProfileId?: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public static builder(
    companyId: string,
    invitedByRecruiterProfileId: string,
    companyRoleId: string,
    email: string,
    token: string,
    expiresAt: Date,
  ): IBuilder<CompanyInvitation> {
    return Builder(CompanyInvitation, {
      companyId,
      invitedByRecruiterProfileId,
      companyRoleId,
      email,
      token,
      status: 'pending',
      expiresAt,
    });
  }
}
