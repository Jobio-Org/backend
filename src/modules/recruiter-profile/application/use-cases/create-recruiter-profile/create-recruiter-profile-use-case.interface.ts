import { type IUseCase } from '~shared/application/use-cases/use-case.interface';

import { type CreateRecruiterProfileDto } from '../../dto/create-recruiter-profile.dto';

export interface ICreateRecruiterProfileUseCase extends IUseCase<CreateRecruiterProfileDto, void> {}
