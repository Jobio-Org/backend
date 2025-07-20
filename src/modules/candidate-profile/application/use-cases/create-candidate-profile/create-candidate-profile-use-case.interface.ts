import { type IUseCase } from '~shared/application/use-cases/use-case.interface';

import { type CreateCandidateProfileDto } from '../../dto/create-candidate-profile.dto';

export interface ICreateCandidateProfileUseCase extends IUseCase<CreateCandidateProfileDto, void> {}
