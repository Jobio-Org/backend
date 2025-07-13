export interface ICompanyPermissionQueryService {
  canEditCompanyInfo(userId: string, companyId: string): Promise<boolean>;
  getUserCompanyRole(userId: string, companyId: string): Promise<string | null>;
} 