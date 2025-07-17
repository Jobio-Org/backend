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
  toDomain(persistence: ICompanyInvitationDataAccess): CompanyInvitation {
    return CompanyInvitation.builder(
      persistence.companyId,
      persistence.invitedByRecruiterProfileId,
      persistence.companyRoleId,
      persistence.email,
      persistence.token,
      persistence.expiresAt,
    )
      .firstName(persistence.firstName ?? undefined)
      .lastName(persistence.lastName ?? undefined)
      .message(persistence.message ?? undefined)
      .status(persistence.status)
      .expiresAt(persistence.expiresAt)
      .acceptedAt(persistence.acceptedAt ?? undefined)
      .acceptedByRecruiterProfileId(persistence.acceptedByRecruiterProfileId ?? undefined)
      .createdAt(persistence.createdAt)
      .updatedAt(persistence.updatedAt)
      .id(persistence.id)
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
