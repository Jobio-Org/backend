import { CompanyInvitation } from '~modules/companies/domain/entities/company-invitation.entity';

export interface ICompanyInvitationRepository {
  create(invitation: Partial<CompanyInvitation>): Promise<CompanyInvitation>;
  findPendingByEmailAndCompany(email: string, companyId: string): Promise<CompanyInvitation | null>;
}
