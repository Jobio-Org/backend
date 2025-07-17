import { GetRecruiterProfileByUserIdDto } from '~modules/profiles/application/dto/get-recruiter-profile-by-user-id.dto';
import { RecruiterProfile } from '~modules/profiles/domain/entities/recruiter-profile.entity';

export interface IGetRecruiterProfileUseCase {
  execute(dto: GetRecruiterProfileByUserIdDto): Promise<RecruiterProfile | null>;
}
