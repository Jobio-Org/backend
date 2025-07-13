export interface IProfilesQueryService {
  getRecruiterProfileIdByUserId(userId: string): Promise<string | null>;
} 