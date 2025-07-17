import { Builder, IBuilder } from 'builder-pattern';

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

  public static builder(companyId: string, invitedByRecruiterProfileId: string, companyRoleId: string, email: string, token: string): IBuilder<CompanyInvitation> {
    return Builder(CompanyInvitation, {
      companyId,
      invitedByRecruiterProfileId,
      companyRoleId,
      email,
      token,
      status: 'pending',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    });
  }

  static withId(id: string) { return (b: CompanyInvitation) => Builder(CompanyInvitation, { ...b, id }); }
  static withFirstName(firstName?: string) { return (b: CompanyInvitation) => Builder(CompanyInvitation, { ...b, firstName }); }
  static withLastName(lastName?: string) { return (b: CompanyInvitation) => Builder(CompanyInvitation, { ...b, lastName }); }
  static withMessage(message?: string) { return (b: CompanyInvitation) => Builder(CompanyInvitation, { ...b, message }); }
  static withStatus(status: string) { return (b: CompanyInvitation) => Builder(CompanyInvitation, { ...b, status }); }
  static withExpiresAt(expiresAt: Date) { return (b: CompanyInvitation) => Builder(CompanyInvitation, { ...b, expiresAt }); }
  static withAcceptedAt(acceptedAt?: Date) { return (b: CompanyInvitation) => Builder(CompanyInvitation, { ...b, acceptedAt }); }
  static withAcceptedByRecruiterProfileId(id?: string) { return (b: CompanyInvitation) => Builder(CompanyInvitation, { ...b, acceptedByRecruiterProfileId: id }); }
  static withCreatedAt(date: Date) { return (b: CompanyInvitation) => Builder(CompanyInvitation, { ...b, createdAt: date }); }
  static withUpdatedAt(date: Date) { return (b: CompanyInvitation) => Builder(CompanyInvitation, { ...b, updatedAt: date }); }
} 