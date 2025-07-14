export interface ICompaniesQueryService {
  getActiveCompanyIdByRecruiterProfileId(recruiterProfileId: string): Promise<string | null>;
} 