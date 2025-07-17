import { CompanyInvitation } from '~modules/companies/domain/entities/company-invitation.entity';

export interface ICompanyInvitationDataAccess {
  id: string;
  companyId: string;
  invitedByRecruiterProfileId: string;
  companyRoleId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  message: string | null;
  token: string;
  status: string;
  expiresAt: Date;
  acceptedAt: Date | null;
  acceptedByRecruiterProfileId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class CompanyInvitationMapper {
  toDomain(raw: ICompanyInvitationDataAccess): CompanyInvitation {
    return CompanyInvitation.builder(
      raw.companyId,
      raw.invitedByRecruiterProfileId,
      raw.companyRoleId,
      raw.email,
      raw.token,
    )
      .firstName(raw.firstName ?? undefined)
      .lastName(raw.lastName ?? undefined)
      .message(raw.message ?? undefined)
      .status(raw.status)
      .expiresAt(raw.expiresAt)
      .acceptedAt(raw.acceptedAt ?? undefined)
      .acceptedByRecruiterProfileId(raw.acceptedByRecruiterProfileId ?? undefined)
      .createdAt(raw.createdAt)
      .updatedAt(raw.updatedAt)
      .id(raw.id)
      .build();
  }

  toPersistence(entity: CompanyInvitation): ICompanyInvitationDataAccess {
    return {
      id: entity.id,
      companyId: entity.companyId,
      invitedByRecruiterProfileId: entity.invitedByRecruiterProfileId,
      companyRoleId: entity.companyRoleId,
      email: entity.email,
      firstName: entity.firstName ?? null,
      lastName: entity.lastName ?? null,
      message: entity.message ?? null,
      token: entity.token,
      status: entity.status,
      expiresAt: entity.expiresAt,
      acceptedAt: entity.acceptedAt ?? null,
      acceptedByRecruiterProfileId: entity.acceptedByRecruiterProfileId ?? null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
} 