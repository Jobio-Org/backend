import { GetRecruiterProfileIdDto } from '~modules/profiles/application/dto/get-recruiter-profile-id.dto';
 
export interface IGetRecruiterProfileIdUseCase {
  execute(dto: GetRecruiterProfileIdDto): Promise<string | null>;
} 