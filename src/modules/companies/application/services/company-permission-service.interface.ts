export interface ICompanyPermissionService {
  canEditCompanyInfo(userId: string, companyId: string): Promise<boolean>;
  getUserCompanyRole(userId: string, companyId: string): Promise<string | null>;
} 